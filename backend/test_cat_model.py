import unittest
from models import User, Cat, db
from app import app

# Setup your app to use the testing configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost/Room8CatteryTest'
app.config['TESTING'] = True

class CatModelTestCase(unittest.TestCase):
    """Test cases for the Cat model."""

    def setUp(self):
        """Create test client, add sample data."""
        db.create_all()

        # Create sample user
        user1 = User.signup("testuser", "test@test.com", "password", "Test", "User", 1234567890, False, True)
        user1.id = 1111
        db.session.commit()

        # Create sample cat
        cat1 = Cat(cat_name='Fluffy', age=2, gender='Female', breed='Persian', description='Very fluffy.', special_needs='None', microchip=123456789, cat_image='http://example.com/fluffy.jpg', is_featured=False, adopted=False, foster_id=user1.id)
        db.session.add(cat1)
        db.session.commit()

        self.cat1_id = cat1.id
        self.user1_id = user1.id
        self.client = app.test_client()

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

    # Additional tests can include invalid data, checking for default values, etc.

if __name__ == '__main__':
    unittest.main()
