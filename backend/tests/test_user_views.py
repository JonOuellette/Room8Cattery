import os
from unittest import TestCase
from models import db, User
from app import create_app


# Set database URI for testing purposes
os.environ['DATABASE_URL'] = "postgresql:///Room8CatteryTest"

app = create_app({'TESTING': True, 'WTF_CSRF_ENABLED': False})

# Connects to test database
with app.app_context():
    db.drop_all()
    db.create_all()


class UserViewTestCase(TestCase):
    """Test views for users."""

    def setUp(self):
        """Create test client, add sample data."""
        self.app = create_app({'TESTING': True, 'WTF_CSRF_ENABLED': False})
        self.client = self.app.test_client()

        with self.app.app_context():
            db.drop_all()
            db.create_all()

            self.testuser = User.signup(username="testuser",
                                        email="test@test.com",
                                        password="testuser",
                                        first_name="Test",
                                        last_name="User",
                                        phone_number="1234567890",
                                        is_admin=False,
                                        is_foster=True)
            self.testuser.id = 3333
            
            db.session.commit()

            self.other_testuser = User.signup(
                username="otheruser",
                email="otheruser@test.com",
                password="testpassword",
                first_name="Other",
                last_name="User",
                phone_number="9876543210",
                is_admin=False,
                is_foster=False
            )
            db.session.commit()

            self.admin_user = User.signup(
                username="adminuser",
                email="admin@test.com",
                password="password",
                first_name="Admin",
                last_name="User",
                phone_number = '9999999999',
                is_admin=True,
                is_foster = False
            )
            db.session.commit()
        
             # Log in as admin user
            with self.client as c:
                resp = c.post("/login", json={"username": "adminuser", "password": "password"})
                self.assertEqual(resp.status_code, 200)
                self.token = resp.json['access_token']

    def tearDown(self):
        """Clean up fouled transactions."""
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_create_user(self):
        with self.client as c:
            resp = c.post("/api/users/create", json={
                "username": "newtestuser",
                "email": "newtest@test.com",
                "password": "newtestpassword",
                "first_name": "NewTest",
                "last_name": "User",
                "phone_number": "0987654321",
                "is_admin": False,
                "is_foster": True
            }, headers={"Authorization": f"Bearer {self.token}"})
            self.assertEqual(resp.status_code, 201)

    def test_user_login(self):
        with self.client as c:
            resp = c.post('/login', json={"username": "testuser", "password": "testuser"})
            self.assertEqual(resp.status_code, 200)

    def test_user_logout(self):
        with self.client as c:
            # Log in first
            c.post('/login', json={"username": "testuser", "password": "testuser"})

            # Then log out
            resp = c.post('/logout')
            self.assertEqual(resp.status_code, 200)

    def test_create_user_with_missing_fields(self):
        """Test creating a user with missing required fields."""
        with self.client as c:
            # Missing 'email' and 'password'
            resp = c.post("/api/users/create", json={
                "username": "incompleteuser",
                "first_name": "Incomplete",
                "last_name": "User",
                "phone_number": "1234567890",
                "is_admin": False,
                "is_foster": False
            }, headers={"Authorization": f"Bearer {self.token}"})
            self.assertEqual(resp.status_code, 400)

    def login_as_admin(self):
        """Helper method for logging in as an admin user."""
        with self.client as c:
            resp = c.post('/login', json={"username": "adminuser", "password": "password"})
            self.assertEqual(resp.status_code, 200)
            # Extract the token from the response
            token = resp.json.get('access_token')
            return token

    def test_get_user_details(self):
        """Test retrieving a specific user's details."""
        # Log in as the admin user and get the token
        token = self.login_as_admin()

        with self.app.app_context():
            # Create a new session for test verification
            with db.session.begin():
                # Pre-fetch the user to ensure it is attached to the current session
                test_user = db.session.merge(self.testuser)
                # Use the token to authorize the request and perform the test
                resp = self.client.get(f"/api/users/{test_user.id}", headers={"Authorization": f"Bearer {token}"})
                self.assertEqual(resp.status_code, 200)
                self.assertIn(test_user.username, resp.json['username'])

    def test_update_user_invalid_email(self):
        """Test updating user information with an invalid email."""
        token = self.login_as_admin()

        with self.app.app_context():
            with db.session.begin():
                test_user = db.session.merge(self.testuser)
                print("EMAIL VAIDATION TEST", test_user)
                resp = self.client.patch(f"/api/users/{test_user.id}/update", json={
                    "email": "notanemail"
                }, headers={"Authorization": f"Bearer {token}"})
                
                self.assertEqual(resp.status_code, 400)

    def test_update_user_valid_email(self):
        """Test updating user information with an invalid email."""
        token = self.login_as_admin()

        with self.app.app_context():
            with db.session.begin():
                test_user = db.session.merge(self.testuser)
                print("EMAIL VAIDATION TEST", test_user)
                resp = self.client.patch(f"/api/users/{test_user.id}/update", json={
                    "email": "isvalid@email.com"
                }, headers={"Authorization": f"Bearer {token}"})
                
                self.assertEqual(resp.status_code, 200)


    def test_user_authentication_fail(self):
        """Test user authentication with wrong password."""
        with self.client as c:
            resp = c.post('/login', json={"username": "testuser", "password": "wrongpassword"})
            self.assertEqual(resp.status_code, 401)

    def test_user_deletion_unauthorized(self):
        """Test unauthorized deletion attempt of a user."""
        with self.client as c:
            # Log in as a regular user (not an admin) before attempting deletion
            login_resp = c.post('/login', json={"username": "testuser", "password": "testuser"})
            token = login_resp.json.get('access_token')
            
            # Ensure the other_testuser is properly set in the database and can be referenced
            with self.app.app_context():
                other_testuser = db.session.merge(self.other_testuser)

            # Attempt to delete another user while logged in as a regular user
            resp = c.delete(f"/api/users/{other_testuser.id}", headers={"Authorization": f"Bearer {token}"})
            self.assertEqual(resp.status_code, 403)

    def test_get_user_not_found(self):
        """Test retrieving a user that does not exist."""
        with self.client as c:
            resp = c.get("/api/users/99999", headers={"Authorization": f"Bearer {self.token}"}) 
            self.assertEqual(resp.status_code, 404)


    def test_get_all_fosters(self):
        """Test retrieving all foster users."""
        with self.client as c:
            resp = c.get("/api/fosters", headers={"Authorization": f"Bearer {self.token}"})
            self.assertEqual(resp.status_code, 200)
            # Check that the response is a list
            self.assertIsInstance(resp.json, list)

    def test_get_foster_cats(self):
        """Test retrieving cats fostered by a specific user."""
        # Log in as the admin user and get the token
        token = self.login_as_admin()

        with self.app.app_context():
            # Ensure the test user who is a foster is properly set in the database and can be referenced
            test_user = db.session.merge(self.testuser)
            
            # Use the token to authorize the request and perform the test for retrieving fostered cats
            resp = self.client.get(f"/api/fosters/{test_user.id}/cats", headers={"Authorization": f"Bearer {token}"})
            
            self.assertEqual(resp.status_code, 200)
            # Check that the response contains a list (indicating the returned fostered cats)
            self.assertIsInstance(resp.json, list)
            # Further checks can include verifying the contents of the list if necessary, such as checking for specific cat attributes


if __name__ == "__main__":
    import unittest
    unittest.main()
