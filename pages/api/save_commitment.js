// pages/api/save_commitment.js
import supabase from '../../lib/db'

export default async function handler(req, res) {
  const { email, address } = req.body;

  if (email && email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) && address) {
    try {
      const { error } = await supabase
        .from('commitments')
        .insert([{ email, address, timestamp: new Date().toISOString() }]);
      
      if (error) {
        throw error;
      }

      res.status(200).json({ message: 'Commitment saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to store commitment in Supabase' });
    }
  } else {
    res.status(400).json({ error: 'Invalid input' });
  }
}
