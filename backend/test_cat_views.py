import os
import unittest
from models import db, connect_db, User, Cat
from app import app

# Use the testing database
os.environ['DATABASE_URL'] = 'postgresql://postgres:postgres@localhost/Room8CatteryTest'

# Configure your app for testing mode
app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

# Make Flask errors be real errors, rather than HTML pages with error info
app.config['TESTING'] = True

# This disables CSRF checking for the testing
app.config['WTF_CSRF_ENABLED'] = False

CURR_USER_KEY = "current_user"  


class CatViewTestCase(unittest.TestCase):
    """Test views for cats."""

    def setUp(self):
        """Create test client, add sample data."""
        db.drop_all()
        db.create_all()

        self.client = app.test_client()

        self.testuser = User.signup(username="testuser",
                                    email="test@test.com",
                                    password="testuser",
                                    first_name="Test",
                                    last_name="User",
                                    phone_number=1234567890,
                                    is_admin=False,
                                    is_foster=True)
        self.testuser_id = 9999
        self.testuser.id = self.testuser_id

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
        self.adminuser.id = self.adminuser_id

        db.session.add_all([self.testuser, self.adminuser])
        db.session.commit()

        self.testcat = Cat(cat_name="TestCat",
                           age=3,
                           gender="Female",
                           breed="TestBreed",
                           description="TestDesc",
                           special_needs="None",
                           microchip=123456789,
                           cat_image="http://example.com/cat.jpg",
                           is_featured=True,
                           adopted=False,
                           foster_id=self.testuser.id)
        db.session.add_all([self.testuser, self.testcat])
        db.session.commit()

    def tearDown(self):
        """Clean up fouled transactions."""
        db.session.rollback()

    def test_get_adoptable_cats(self):
        with self.client as c:
            resp = c.get("/api/cats/adoptable")
            self.assertIn("TestCat", str(resp.data))
            self.assertEqual(resp.status_code, 200)

    def test_get_cat_details(self):
        with self.client as c:
            resp = c.get(f"/api/cats/{self.testcat.id}")
            self.assertEqual(resp.status_code, 200)
            self.assertIn("TestCat", str(resp.data))

    def login_and_get_token(self):
        resp = self.client.post('/login', json={"username": "testuser", "password": "testuser"})
        token = resp.json['access_token']
        return token
    
    def test_add_cat(self):
        with self.client as c:
            token = self.login_and_get_token('testuser', 'testuser')  # Updated this line

            # New cat data
            cat_data = {
                "cat_name": "NewCat",
                "age": 5,
                "gender": "Male",
                "breed": "NewBreed",
                "description": "NewDesc",
                "special_needs": "None",
                "microchip": 987654321,
                "cat_image": "http://example.com/newcat.jpg",
                "is_featured": False,
                "adopted": False
            }

            resp = c.post("/api/cats", json=cat_data, headers={"Authorization": f"Bearer {token}"})
            self.assertEqual(resp.status_code, 201)


    def test_update_cat_info(self):
        with self.client as c:
            token = self.login_and_get_token('adminuser', 'adminuser')  # Updated this line

            # Updated cat data
            cat_data = {
                "cat_name": "UpdatedCat",
                "age": 4,
                "gender": "Female",
                "breed": "UpdatedBreed",
                "description": "UpdatedDesc",
                "special_needs": "None",
                "microchip": 987654321,
                "cat_image": "http://example.com/updatedcat.jpg",
                "is_featured": True,
                "adopted": False
            }

            resp = c.patch(f"/api/cats/{self.testcat.id}", json=cat_data, headers={"Authorization": f"Bearer {token}"})
            self.assertEqual(resp.status_code, 200)


    def login_and_get_token(self, username, password):
        """Login using the given username and password and return the JWT token."""
        resp = self.client.post('/login', json={"username": username, "password": password})
        self.assertEqual(resp.status_code, 200, f"Login failed for user {username}, cannot proceed with tests.")
        return resp.json['access_token']

    def test_delete_cat(self):
        with self.client as c:
            admin_token = self.login_and_get_token('adminuser', 'adminuser')  # Get the admin token for login

            # Delete the cat
            resp = c.delete(f"/api/cats/{self.testcat.id}", headers={"Authorization": f"Bearer {admin_token}"})
            self.assertEqual(resp.status_code, 200)
            self.assertIn('Cat deleted successfully', str(resp.data))

    def test_feature_cat(self):
        with self.client as c:
            admin_token = self.login_and_get_token('adminuser', 'adminuser')  # Use admin token for authorization

            # Feature the cat
            resp = c.patch(f"/api/cats/{self.testcat.id}/feature", headers={"Authorization": f"Bearer {admin_token}"})
            self.assertEqual(resp.status_code, 200, f"Unexpected status code: {resp.status_code}. Response: {resp.data}")

            # Check if response includes 'is_featured' field and validate its value
            self.assertIn('is_featured', str(resp.data), "Response must contain 'is_featured' field.")
            data = resp.get_json()
            self.assertIn('is_featured', data, "JSON response should include 'is_featured' key.")
            self.assertIsInstance(data['is_featured'], bool, "'is_featured' should be a boolean.")

    def test_reassign_cat(self):
        # First create a new user to reassign the cat to
        new_foster = User.signup(username="newfoster",
                                email="newfoster@test.com",
                                password="newpassword",
                                first_name="New",
                                last_name="Foster",
                                phone_number=9876543210,
                                is_admin=False,
                                is_foster=True)
        db.session.add(new_foster)
        db.session.commit()

        with self.client as c:
            admin_token = self.login_and_get_token('adminuser', 'adminuser')  # Get the admin token for login

            # Reassign the cat
            resp = c.post(f"/api/cats/{self.testcat.id}/reassign", json={"new_foster_id": new_foster.id}, headers={"Authorization": f"Bearer {admin_token}"})
            self.assertEqual(resp.status_code, 200)
            self.assertIn('Cat reassigned successfully', str(resp.data))
            self.assertIn(str(new_foster.id), str(resp.data))  # Check if new foster's ID is in response


if __name__ == "__main__":
    unittest.main()
