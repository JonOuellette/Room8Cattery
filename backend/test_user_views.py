import os
import unittest
from app import app
from models import db, User, Cat, connect_db
import json

# Use test database and don't clutter tests with SQL
os.environ['DATABASE_URL'] = "postgresql:///room8cattery_test"

# Configure your app for testing mode
app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

app.config['WTF_CSRF_ENABLED'] = False

CURR_USER_KEY = "current_user"  

class UserViewTestCase(unittest.TestCase):
    """Test views for users."""

    def setUp(self):
        """Create test client, add sample data."""
        db.drop_all()
        db.create_all()

        self.client = app.test_client()

        self.testuser = User.signup(
            username="testuser",
            email="test@test.com",
            password="password",  
            first_name="Test",
            last_name="User",
            phone_number="1234567890",
            is_admin=False,
            is_foster=True
        )
        self.testuser_id = 9999
        

        self.testuser2 = User.signup(
            username="testuser2",
            email="test2@test.com",
            password="password",  
            first_name="Test2",
            last_name="User2",
            phone_number="1234567890",
            is_admin=False,
            is_foster=True
        )
        self.testuser2_id = 7777
        
        
        # Admin user
        self.adminuser = User.signup(username="adminuser",
                                     email="admin@test.com",
                                     password="adminuser",
                                     first_name="Admin",
                                     last_name="User",
                                     phone_number=9876543210,
                                     is_admin=True,
                                     is_foster=False)
        self.adminuser_id = 8888  
        
        db.session.add_all([self.testuser, self.testuser2, self.adminuser])
        db.session.commit()


    def tearDown(self):
        """Clean up any fouled transaction."""
        db.session.rollback()

    def test_create_user(self):
        with self.client as c:
            admin_token = self.login_and_get_token('adminuser', 'adminuser')
            new_user = {
                "username": "newuser",
                "email": "new@test.com",
                "password": "newpassword",
                "first_name": "New",
                "last_name": "User",
                "phone_number": "9876543210",
                "is_admin": False,
                "is_foster": False
            }

            resp = c.post("/api/users/create", json = new_user, headers = {"Authorization": f"Bearer {admin_token}"} )
            self.assertEqual(resp.status_code, 201)
            self.assertIn('User created successfully', str(resp.data))

    def test_user_login(self):
        """Test user can login."""
        with self.client as c:
            resp = c.post('/login', json={"username": "testuser", "password": "password"})
            self.assertEqual(resp.status_code, 200)
            self.assertIn('access_token', resp.json)

    def test_get_current_user_details(self):
        """Test fetching details of the currently authenticated user."""
        token = self.login_and_get_token("testuser", "password")  # Make sure these are correct
        resp = self.client.get('/api/users/me', headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(resp.status_code, 200)
        self.assertIn("testuser", str(resp.data))

    
    def login_and_get_token(self, username, password):
        """Login using the given username and password and return the JWT token."""
        resp = self.client.post('/login', json={"username": username, "password": password})
        self.assertEqual(resp.status_code, 200, f"Login failed for user {username}, cannot proceed with tests.")
        return resp.json['access_token']

    def test_get_user_details(self):
        """Test fetching user details with valid authorization"""
        with self.client as c:
            token = self.login_and_get_token("adminuser", "adminuser")
            resp = c.get(f'/api/users/{self.testuser_id}', headers={"Authorization": f"Bearer {token}"})
            self.assertEqual(resp.status_code, 200)
            self.assertIn("testuser", str(resp.data))

    def test_update_user_unauthorized(self):
        """Test updating user information without authorization"""
        with self.client as c:
            resp = c.patch(f'/api/users/{self.testuser_id}/update', json={"first_name": "Updated"})
            self.assertEqual(resp.status_code, 401)

    def test_update_user(self):
        """Test updating user information with valid authorization"""
        with self.client as c:
            token = self.login_and_get_token("testuser", "password")
            resp = c.patch(f'/api/users/{self.testuser_id}/update', 
            headers={"Authorization": f"Bearer {token}"},
            json={"first_name": "Updated"})
            self.assertEqual(resp.status_code, 200)
            updated_user = json.loads(resp.data)
            self.assertEqual(updated_user['first_name'], 'Updated')

    def test_delete_user_unauthorized(self):
        """Test deleting a user without authorization"""
        with self.client as c:
            resp = c.delete(f'/api/users/{self.testuser_id}')
            self.assertEqual(resp.status_code, 401)

    def test_delete_user_authorized(self):
        """Test deleting a user with valid authorization"""
        with self.client as c:
            admin_token = self.login_and_get_token('adminuser', 'adminuser')
            resp = c.delete(f'/api/users/{self.testuser2_id}', headers={"Authorization": f"Bearer {admin_token}"})
            self.assertEqual(resp.status_code, 200)
            self.assertIn('successfully deleted', str(resp.data))

    def test_user_logout(self):
        """Test user logout"""
        with self.client as c:
            token = self.login_and_get_token("testuser", "password")
            resp = c.post('/logout', headers={"Authorization": f"Bearer {token}"})
            self.assertEqual(resp.status_code, 200)
            self.assertIn('successfully logged out', str(resp.data))


if __name__ == "__main__":
    unittest.main()
