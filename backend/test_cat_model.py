import unittest
from app import create_app, db 
from models import User, Cat
from sqlalchemy.exc import IntegrityError

class CatModelTestCase(unittest.TestCase):
    """Test cases for the Cat model."""

    def setUp(self):
        """Create test client."""
        self.app = create_app({'TESTING': True, 'SQLALCHEMY_DATABASE_URI': 'postgresql://postgres:postgres@localhost/Room8CatteryTest'})
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        # Correct the line below:
        print("********************************Testing database URI:", self.app.config['SQLALCHEMY_DATABASE_URI'])
        # Create sample user
        user1 = User.signup("testuser100", "test@test.com", "password", "Test", "User", 1234567890, False, True)
        user1.id = 1111
        db.session.commit()

        # Create sample cat
        cat1 = Cat(cat_name='Fluffy', age=2, gender='Female', breed='Persian', description='Very fluffy.', special_needs='None', microchip=123456789, cat_image='http://example.com/fluffy.jpg', is_featured=False, adopted=False, foster_id=user1.id)
        db.session.add(cat1)
        db.session.commit()

        self.cat1_id = cat1.id
        self.user1_id = user1.id
        self.client = self.app.test_client()

    def tearDown(self):
        """Clean up any fouled transaction."""
        db.session.rollback()
        db.drop_all()

    def test_cat_model(self):
        """Does basic model work?"""

        # Cat should have expected attributes and correct foster
        cat = Cat.query.get(self.cat1_id)
        self.assertEqual(cat.cat_name, 'Fluffy')
        self.assertEqual(cat.age, 2)
        self.assertEqual(cat.gender, 'Female')
        self.assertEqual(cat.breed, 'Persian')
        self.assertEqual(cat.description, 'Very fluffy.')
        self.assertEqual(cat.special_needs, 'None')
        self.assertEqual(cat.microchip, 123456789)
        self.assertEqual(cat.cat_image, 'http://example.com/fluffy.jpg')
        self.assertFalse(cat.is_featured)
        self.assertFalse(cat.adopted)
        self.assertEqual(cat.foster_id, self.user1_id)

    def test_cat_foster_relationship(self):
        """Does the foster relationship work?"""

        # Get the user and cat from the db
        user = User.query.get(self.user1_id)
        cat = Cat.query.get(self.cat1_id)

        # User should be the foster of the cat
        self.assertEqual(cat.foster_user, user)
        self.assertIn(cat, user.cats_fostered)

    def test_create_cat(self):
        """Can we create a cat successfully?"""

        cat2 = Cat(cat_name='Shadow', age=3, gender='Male', breed='Tabby', description='Shy and stealthy.', special_needs='None', microchip=987654321, cat_image='http://example.com/shadow.jpg', is_featured=True, adopted=False, foster_id=self.user1_id)
        db.session.add(cat2)
        db.session.commit()

        # Cat should be found in the database
        self.assertIsNotNone(Cat.query.get(cat2.id))
        self.assertEqual(cat2.cat_name, 'Shadow')
        self.assertTrue(cat2.is_featured)

    def test_invalid_cat_creation(self):
        """Attempting to create a cat with invalid data fails."""
        with self.app.app_context():
            invalid_cat = Cat(cat_name='Test', age = 0, gender='Female', breed='Test', microchip=-1)
            db.session.add(invalid_cat)
            try:
                # Attempt to commit the session to trigger the IntegrityError
                db.session.commit()
            except IntegrityError:
                # If an IntegrityError is caught, pass the test
                db.session.rollback()  # Roll back the session to clean up
                return
            except Exception as e:
                # If an unexpected exception is caught, fail the test with the error message
                self.fail(f'Unexpected exception raised: {e}')
            # Explicitly fail the test if no exceptions are raised
            self.fail('IntegrityError was not raised')



    def test_default_values(self):
        """Test default values for is_featured and adopted."""
        default_cat = Cat(cat_name='Default', age=4, gender='Male', breed='Mixed', microchip=123456789)
        db.session.add(default_cat)
        db.session.commit()

        cat = Cat.query.get(default_cat.id)
        self.assertFalse(cat.is_featured)
        self.assertFalse(cat.adopted)

    def test_update_cat_info(self):
        """Test updating cat information."""
        cat = Cat.query.get(self.cat1_id)
        cat.age = 3
        cat.description = 'Updated description.'
        db.session.commit()

        updated_cat = Cat.query.get(self.cat1_id)
        self.assertEqual(updated_cat.age, 3)
        self.assertEqual(updated_cat.description, 'Updated description.')

    def test_delete_cat(self):
        """Test deleting a cat."""
        cat = Cat.query.get(self.cat1_id)
        db.session.delete(cat)
        db.session.commit()

        deleted_cat = Cat.query.get(self.cat1_id)
        self.assertIsNone(deleted_cat)


if __name__ == '__main__':
    unittest.main()
