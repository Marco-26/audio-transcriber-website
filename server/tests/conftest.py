import pytest

from src import db, create_app, User, FileEntry

@pytest.fixture(autouse=True, scope="session")
def app_dict():
   """
   Application instantiator for each unit test session.

   1) Build the application base at beginning of session
   2) Create database tables, yield the app and db for individual tests
   3) Final tear down logic at the end of the session

   For details as to how the "yield" command fits into this pytest fixture:
   https://docs.pytest.org/en/6.2.x/fixture.html#yield-fixtures-recommended
   """
   ##create_app() is a Flask App Engine. Replace with your equivalent.
   app = create_app()
   app.config.update(
       {
           "TESTING": True,
       }
   )

   with app.app_context():
       db.create_all()

       yield {"app": app, "db": db}

       db.session.remove()
       if "test" in app.config["SQLALCHEMY_DATABASE_URI"]:
           db.drop_all()

@pytest.fixture()
def client(app_dict):
    """
    Smaller initialization and teardown for each individual unit test.
    """
    app = app_dict["app"]
    base_db = app_dict["db"]
    client = app.test_client()

    with client.session_transaction() as sess:
        sess['user_id'] = "test_user_id"

    yield client

    clean_db_contents(base_db, [FileEntry, User])  # Clean tables in the correct order
    base_db.session.rollback()

def clean_db_contents(db_to_clean, list_of_tables_to_clear: list):
   """
   Wipes all rows from database tables, for use at the end of unit tests.
   """
   for table in list_of_tables_to_clear:
       db_to_clean.session.query(table).delete()

   db_to_clean.session.commit()