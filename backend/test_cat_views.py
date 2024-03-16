import os
from unittest import TestCase
from models import db, Cat, User  # Import necessary models, make sure to import Cat model
from app import create_app

# Set database URI for testing purposes
os.environ['DATABASE_URL'] = "postgresql:///Room8CatteryTest"

app = create_app({'TESTING': True, 'WTF_CSRF_ENABLED': False})

class CatViewTestCase(TestCase):
    """Test views for cats."""

    def setUp(self):
        """Create test client, add sample data."""
        self.app = create_app({'TESTING': True, 'WTF_CSRF_ENABLED': False})
        self.client = self.app.test_client()

        with self.app.app_context():
            db.drop_all()
            db.create_all()

            

            self.admin_user = User.signup(username="adminuser",
                                      email="admin@test.com",
                                      password="password",
                                      first_name="Admin",
                                      last_name="User",
                                      phone_number='9999999999',
                                      is_admin=True,
                                      is_foster=False)
            db.session.commit()

            self.admin_token = self.login_as_admin() 
            
            # Creating a user who can be a foster to associate cats with
            self.foster_user = User.signup(
                username="fosteruser",
                email="foster@test.com",
                password="fosterpass",
                first_name="Foster",
                last_name="User",
                phone_number="1234567890",
                is_admin=False,
                is_foster=True
            )
            db.session.commit()

            # Creating a sample cat to be associated with foster_user
            self.test_cat = Cat(
                cat_name="TestCat",
                age=2,
                breed="TestBreed",
                description="TestDesc",
                gender="Female",
                special_needs="None",
                cat_image="testimage.png",
                is_featured=False,
                adopted=False,
                foster_id=self.foster_user.id
            )
            db.session.add(self.test_cat)
            db.session.commit()

            # Log in as foster user
            with self.client as c:
                resp = c.post("/login", json={"username": "fosteruser", "password": "fosterpass"})
                self.assertEqual(resp.status_code, 200)
                self.token = resp.json['access_token']

    def login_as_admin(self):
        """Helper method for logging in as an admin user and retrieving the token."""
        with self.app.app_context():
            with self.client as c:
                resp = c.post('/login', json={"username": "adminuser", "password": "password"})
                self.assertEqual(resp.status_code, 200)
                token = resp.json.get('access_token')
                return token

    def tearDown(self):
        """Clean up fouled transactions."""
        with self.app.app_context():
            db.session.remove()
            db.drop_all()


    def test_get_adoptable_cats(self):
        with self.client as client:
            resp = client.get('/api/cats/adoptable')
            self.assertEqual(resp.status_code, 200)
            self.assertIsInstance(resp.json, list)
    
    def test_get_cat_details(self):
        with self.client as client:
           
            with self.app.app_context():
                
                with db.session.begin():
                    
                    test_cat = db.session.merge(self.test_cat)
                    
                    resp = client.get(f'/api/cats/{test_cat.id}')
                    self.assertEqual(resp.status_code, 200)
                    
    def test_add_cat(self):
        with self.client as client:
            resp = client.post('/api/cats', json={
                "cat_name": "NewCat",
                "age": 2,
                "gender": "Male",
                "breed": "NewBreed",
                "description": "New Description",
                "special_needs": "None",
                "microchip": "123456789",
                "cat_image": "newimage.png",
                "is_featured": False
            }, headers={"Authorization": f"Bearer {self.admin_token}"})
            self.assertEqual(resp.status_code, 201)
            self.assertIn('message', resp.json)

    

    def test_update_cat_adoption(self):
        """Test updating a cat's adoption status."""
        with self.app.app_context():
            # Ensure the test cat is properly set in the database and can be referenced
            test_cat = db.session.merge(self.test_cat)
            
            # Ensure the cat is not adopted before the update
            self.assertFalse(test_cat.adopted)
            
            # Perform the patch request to update the cat's adoption status
            with self.client as client:
                resp = client.patch(f'/api/cats/{test_cat.id}/adopt', headers={"Authorization": f"Bearer {self.admin_token}"})
                
                self.assertEqual(resp.status_code, 200)
                self.assertIn('message', resp.json)
                
                # Re-fetch the cat from the database to get the updated state
                db.session.refresh(test_cat)
                self.assertTrue(test_cat.adopted)

    def test_update_cat_info(self):
        """Test updating cat information."""
        with self.client as client:
            with self.app.app_context():
                # Ensure the test cat is properly set in the database and can be referenced
                test_cat = db.session.merge(self.test_cat)
                
                # Perform the patch request to update the cat's information
                resp = client.patch(f'/api/cats/{test_cat.id}', json={
                    "cat_name": "UpdatedName",
                    "age": test_cat.age,  # Change as necessary
                    # Add other fields as necessary
                }, headers={"Authorization": f"Bearer {self.admin_token}"})
                
                self.assertEqual(resp.status_code, 200)
                self.assertIn('message', resp.json)
                
                # Re-fetch the cat from the database to get the updated state
                db.session.refresh(test_cat)
                self.assertEqual(test_cat.cat_name, "UpdatedName")

    def test_delete_cat(self):
        """Test deleting a cat."""
        with self.client as client:
            with self.app.app_context():
                # Ensure the test cat is properly set in the database and can be referenced
                test_cat = db.session.merge(self.test_cat)
                
                # Perform the delete request to remove the cat
                resp = client.delete(f'/api/cats/{test_cat.id}', headers={"Authorization": f"Bearer {self.admin_token}"})
                
                self.assertEqual(resp.status_code, 200)
                self.assertIn('message', resp.json)
                
                # Check that the cat is no longer in the database
                deleted_cat = Cat.query.get(test_cat.id)
                self.assertIsNone(deleted_cat)

    def test_get_featured_cats(self):
        with self.client as client:
            resp = client.get('/api/cats/featured')
            self.assertEqual(resp.status_code, 200)
            self.assertIsInstance(resp.json, list)

    def test_toggle_cat_featured(self):
        """Test toggling a cat's featured status."""
        with self.client as client:
            with self.app.app_context():
                # Ensure the test cat is properly set in the database and can be referenced
                test_cat = db.session.merge(self.test_cat)
                
                # Perform the patch request to toggle the cat's featured status
                resp = client.patch(f'/api/cats/{test_cat.id}/feature', headers={"Authorization": f"Bearer {self.admin_token}"})
                
                self.assertEqual(resp.status_code, 200)
                self.assertIn('is_featured', resp.json)
                
                # Re-fetch the cat from the database to get the updated state
                db.session.refresh(test_cat)
                self.assertEqual(test_cat.is_featured, resp.json['is_featured'])

    def test_reassign_cat(self):
        """Test reassigning a cat to a new foster."""
        with self.client as client:
            with self.app.app_context():
                # Ensure the test cat and test user are properly set in the database and can be referenced
                test_cat = db.session.merge(self.test_cat)
                test_user = db.session.merge(self.foster_user)  # assuming you have a foster user to reassign to
                
                # Perform the post request to reassign the cat
                resp = client.post(f'/api/cats/{test_cat.id}/reassign', json={"new_foster_id": test_user.id}, headers={"Authorization": f"Bearer {self.admin_token}"})
                
                self.assertEqual(resp.status_code, 200)
                self.assertIn('message', resp.json)
                
                # Re-fetch the cat from the database to get the updated state
                db.session.refresh(test_cat)
                self.assertEqual(test_cat.foster_id, test_user.id)




if __name__ == "__main__":
    import unittest
    unittest.main()