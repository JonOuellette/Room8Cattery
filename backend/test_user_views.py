import os
from unittest import TestCase
from models import db, User, Cat
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
                                        is_foster=False)
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

    # Add more tests for other user functionalities

if __name__ == "__main__":
    import unittest
    unittest.main()
