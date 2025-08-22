export type Error415 = { status: 415; body: { error: string } };
export type Error400InvalidJson = {
  status: 400;
  body: { error: "invalid_json"; message: string };
};
export type Error400BadRequest = { status: 400; body: { error: string } };
export type Error404 = { status: 404; body: { error: string } };
export type Error409 = { status: 409; body: { error: string } };
export type Error422 = {
  status: 422;
  body: { error: "validation_failed"; details: Record<string, string[]> };
};
export type Error500 = { status: 500; body: { error: string } };

export type GenericsErrors =
  | Error415
  | Error400InvalidJson
  | Error400BadRequest
  | Error404
  | Error409
  | Error422
  | Error500;
