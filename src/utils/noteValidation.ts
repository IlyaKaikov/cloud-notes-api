export const isValidId = (value: string): boolean => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0;
};

export const validateNoteInput = (
  title: unknown,
  content: unknown,
): { valid: boolean; message?: string } => {
  if (typeof title !== "string" || typeof content !== "string") {
    return {
      valid: false,
      message: "title and content must be strings",
    };
  }

  if (title.trim().length === 0 || content.trim().length === 0) {
    return {
      valid: false,
      message: "title and content cannot be empty",
    };
  }

  if (title.length > 255) {
    return {
      valid: false,
      message: "title must be at most 255 characters long",
    };
  }

  return { valid: true };
};

export const validatePartialNoteInput = (
  title: unknown,
  content: unknown,
): { valid: boolean; message?: string } => {
  const hasTitle = title !== undefined;
  const hasContent = content !== undefined;

  if (!hasTitle && !hasContent) {
    return {
      valid: false,
      message: "at least one of title or content must be provided",
    };
  }

  if (hasTitle) {
    if (typeof title !== "string") {
      return {
        valid: false,
        message: "title must be a string",
      };
    }

    if (title.trim().length === 0) {
      return {
        valid: false,
        message: "title cannot be empty",
      };
    }

    if (title.length > 255) {
      return {
        valid: false,
        message: "title must be at most 255 characters long",
      };
    }
  }

  if (hasContent) {
    if (typeof content !== "string") {
      return {
        valid: false,
        message: "content must be a string",
      };
    }

    if (content.trim().length === 0) {
      return {
        valid: false,
        message: "content cannot be empty",
      };
    }
  }

  return { valid: true };
};