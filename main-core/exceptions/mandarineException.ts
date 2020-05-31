export class MandarineException extends Error {

    public static MIDDLEWARE_NON_VALID_IMPL: string = "Middleware cannot be initialized because it is not an implemention of 'MiddlewareTarget'";
    public static INVALID_TEMPLATE: string = "The template %templatePath% could not be initialized. This may be caused because the path is incorrect.";
    public static UNDEFINED_TEMPLATE: string = "The template could not be initialized because its path is undefined";
    public static INVALID_PROPERTY_FILE: string = "The property file (%propertyFile%) you are trying to use is either invalid or could not be parsed";
  
    constructor(public message: string, public objectName: string) {
      super(message + " ~ Object name: " + objectName);
      this.name = "MandarineException";
      this.stack = (this).stack;
    }
  
}