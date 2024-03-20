import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mailchimp from '@mailchimp/mailchimp_marketing';

dotenv.config();

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER,
});

const port = process.env.PORT || 7000;

const app = express();

app.use(cors());

app.use(express.json());

app.post('/addSubscriber', async (req, res) => {
  const { email } = req.body;

  try {
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID,
      {
        email_address: email,
        status: 'subscribed',
      }
    );

    res.status(200).send(response);
  } catch (error) {
    res
      .status(500)
      .send(JSON.stringify({ error: JSON.parse(error.response.text) }));
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
