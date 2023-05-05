import supabase from '../../lib/db';

export default async function handler(req, res) {
  const { email, address, environment } = req.body;

  if (
    email &&
    email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) &&
    address &&
    (environment === 'prod' || environment === 'dev')
  ) {
    try {
      const { error } = await supabase
        .from('commitments')
        .insert([{ email, address, environment, timestamp: new Date().toISOString() }]);

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
