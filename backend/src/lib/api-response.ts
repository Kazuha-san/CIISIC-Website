import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function created<T>(data: T) {
  return ok(data, 201);
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(message: string, errors?: unknown) {
  return NextResponse.json(
    { success: false, message, errors },
    { status: 400 }
  );
}

export function unauthorized(message = "Authentication required") {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

export function forbidden(message = "You do not have permission") {
  return NextResponse.json({ success: false, message }, { status: 403 });
}

export function notFound(message = "Resource not found") {
  return NextResponse.json({ success: false, message }, { status: 404 });
}

export function conflict(message: string) {
  return NextResponse.json({ success: false, message }, { status: 409 });
}

export function serverError(message = "Internal server error") {
  return NextResponse.json({ success: false, message }, { status: 500 });
}

export function validationError(errors: unknown) {
  return NextResponse.json(
    { success: false, message: "Validation failed", errors },
    { status: 422 }
  );
}

/**
 * Wraps a route handler with try/catch to avoid repetitive error handling.
 */
export function withErrorHandler(
  handler: (...args: unknown[]) => Promise<NextResponse>
) {
  return async (...args: unknown[]) => {
    try {
      return await handler(...args);
    } catch (err) {
      console.error("[API Error]", err);
      return serverError();
    }
  };
}
