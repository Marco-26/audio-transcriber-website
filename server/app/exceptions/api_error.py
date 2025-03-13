import traceback
from flask import jsonify

class APIError(Exception):
  success=False
  pass

class APIAuthError(APIError):
  code = 403
  description = "Authentication Error"
  
class APINotFoundError(APIError):
  code = 404
  description = "Not Found Error"

class APIBadRequestError(APIError):
  code = 400
  description = "Bad Request Error"
  
class APIServerError(APIError):
  code = 500
  description = "Internal Server Error"

def register_error_handlers(app):
  @app.errorhandler(500)
  def handle_exception(err):
    app.logger.error(f"Unknown Exception: {str(err)}")
    app.logger.debug(''.join(traceback.format_exception(etype=type(err), value=err, tb=err.__traceback__)))
    response = {"error": "Sorry, that error is on us, please contact support if this wasn't an accident"}
    return jsonify(response), 500
  
  @app.errorhandler(APIError)
  def handle_exception(err):
    response = {"error": err.description, "message": ""}
    if len(err.args) > 0:
        response["message"] = err.args[0]
    # Add some logging so that we can monitor different types of errors 
    app.logger.error(f"{err.description}: {response['message']}")
    return jsonify(response), err.code
