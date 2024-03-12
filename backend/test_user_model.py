import unittest
from models import User, db
from app import app

# Setup your app to use the testing configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost/Room8CatteryTest'
app.config['TESTING'] = True

class UserModelTestCase(unittest.TestCase):
    """Test cases for User model."""

    def setUp(self):
        """Create test client, add sample data."""
        db.create_all()
        user1 = User.signup("testuser", "test@test.com", "password", "Test", "User", 1234567890, False, False)
        user1.id = 1111

        db.session.commit()

        user1 = User.query.get(user1.id)

        self.user1 = user1
        self.client = app.test_client()

    def tearDown(self):
        """Clean up any fouled transaction."""
        db.session.rollback()
        db.drop_all()

    def test_user_model(self):
        """Does basic model work?"""

        # User should have no messages & no followers
        self.assertEqual(len(self.user1.fostered_cats.all()), 0)

    def test_valid_signup(self):
        """Does User.create successfully create a new user given valid credentials?"""
        u_test = User.signup("testtest", "testtest@test.com", "password", "Testy", "Tester", 1234567890, True, True)
        uid = 99999
        u_test.id = uid
        db.session.commit()

        u_test = User.query.get(uid)
        self.assertIsNotNone(u_test)
        self.assertEqual(u_test.username, "testtest")
        self.assertEqual(u_test.email, "testtest@test.com")
        self.assertEqual(u_test.first_name, "Testy")
        self.assertEqual(u_test.last_name, "Tester")
        self.assertTrue(u_test.is_admin)
        self.assertTrue(u_test.is_foster)
        self.assertNotEqual(u_test.password, "password")
        # Bcrypt strings should start with $2b$
        self.assertTrue(u_test.password.startswith("$2b$"))

    def test_invalid_username_signup(self):
        """Does User.create fail to create a new user if any of the validations (like unique username) fail?"""
        invalid = User.signup(None, "test2@test.com", "password", "Testy", "Tester", 1234567890, False, False)
        uid = 1234567
        invalid.id = uid
        with self.assertRaises(Exception) as context:
            db.session.commit()

    def test_valid_authentication(self):
        """Does User.authenticate successfully return a user when given a valid username and password?"""
        user = User.authenticate(self.user1.username, "password")
        self.assertIsNotNone(user)
        self.assertEqual(user.id, self.user1.id)

    def test_invalid_username(self):
        """Does User.authenticate fail to return a user when the username is invalid?"""
        self.assertFalse(User.authenticate("wrongusername", "password"))

    def test_wrong_password(self):
        """Does User.authenticate fail to return a user when the password is incorrect?"""
        self.assertFalse(User.authenticate(self.user1.username, "wrongpassword"))

if __name__ == '__main__':
    unittest.main()
