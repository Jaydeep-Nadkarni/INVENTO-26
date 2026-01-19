export class EventError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class SlotFullError extends EventError {
    constructor(message = "No slots available for this event") {
        super(message, 409);
    }
}

export class InvalidGenderError extends EventError {
    constructor(message = "Gender does not match event requirements") {
        super(message, 400);
    }
}

export class DuplicateRegistrationError extends EventError {
    constructor(message = "You are already registered for this event") {
        super(message, 409);
    }
}

export class ContingentLimitError extends EventError {
    constructor(message = "Maximum official registrations allowed per college reached") {
        super(message, 429);
    }
}

export class EventNotFoundError extends EventError {
    constructor(message = "Event not found") {
        super(message, 404);
    }
}

export class RegistrationClosedError extends EventError {
    constructor(message = "Registration for this event is closed") {
        super(message, 403);
    }
}

export class TeamSizeError extends EventError {
    constructor(message = "Team size is outside the allowed range") {
        super(message, 400);
    }
}
