const axios = require('axios');
(async () => {
  try {
    const login = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@skybooker.com',
      password: 'admin123'
    });
    console.log('token ok:', !!login.data.token);
    const bookings = await axios.get('http://localhost:5000/api/bookings', {
      headers: { Authorization: `Bearer ${login.data.token}` }
    });
    console.log('bookings found:', bookings.data.length);
    if (bookings.data.length > 0) {
      const id = bookings.data[0]._id;
      console.log('deleting booking', id);
      const res = await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${login.data.token}` }
      });
      console.log('delete response:', res.data);
    }
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
})();
