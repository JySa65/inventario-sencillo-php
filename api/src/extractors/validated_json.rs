use axum::{
    Json,
    extract::{FromRequest, Request},
    http::{StatusCode, header::CONTENT_TYPE},
    response::IntoResponse,
};
use serde::de::DeserializeOwned;
use serde_json::{Value, json};
use validator::Validate;

pub struct ValidatedJson<T>(pub T);

/// Rechazos normalizados (400/415/422)
pub enum ValidatedJsonRejection {
    UnsupportedMediaType, // 415
    InvalidJson(String),  // 400
    Validation(Value),    // 422 { error, details }
}

impl IntoResponse for ValidatedJsonRejection {
    fn into_response(self) -> axum::response::Response {
        match self {
            Self::UnsupportedMediaType => (
                StatusCode::UNSUPPORTED_MEDIA_TYPE,
                Json(json!({ "error": "content_type must be application/json" })),
            )
                .into_response(),
            Self::InvalidJson(msg) => (
                StatusCode::BAD_REQUEST,
                Json(json!({ "error": "invalid_json", "message": msg })),
            )
                .into_response(),
            Self::Validation(body) => {
                (StatusCode::UNPROCESSABLE_ENTITY, Json(body)).into_response()
            }
        }
    }
}

impl<S, T> FromRequest<S, axum::body::Body> for ValidatedJson<T>
where
    S: Send + Sync,
    T: DeserializeOwned + Validate + 'static,
{
    type Rejection = ValidatedJsonRejection;

    // 👇 OJO: el tipo debe ser Request<axum::body::Body>
    async fn from_request(
        req: Request<axum::body::Body>,
        _state: &S,
    ) -> Result<Self, Self::Rejection> {
        // 1) Content-Type
        let ct_ok = req
            .headers()
            .get(CONTENT_TYPE)
            .and_then(|h| h.to_str().ok())
            .map(|ct| ct.starts_with("application/json"))
            .unwrap_or(false);

        if !ct_ok {
            return Err(ValidatedJsonRejection::UnsupportedMediaType);
        }

        // 2) Leer body con límite (1 MiB)
        let bytes = axum::body::to_bytes(req.into_body(), 1024 * 1024)
            .await
            .map_err(|e| ValidatedJsonRejection::InvalidJson(e.to_string()))?;

        // 3) Deserializar
        let value: T = serde_json::from_slice(&bytes)
            .map_err(|e| ValidatedJsonRejection::InvalidJson(e.to_string()))?;

        // 4) Validar
        if let Err(errs) = value.validate() {
            let mut details = serde_json::Map::new();
            for (field, errs) in errs.field_errors() {
                let msgs: Vec<String> = errs
                    .iter()
                    .filter_map(|e| e.message.as_ref().map(|m| m.to_string()))
                    .collect();
                details.insert(field.to_string(), Value::from(msgs));
            }
            return Err(ValidatedJsonRejection::Validation(json!({
                "error": "validation_failed",
                "details": details
            })));
        }

        Ok(ValidatedJson(value))
    }
}
