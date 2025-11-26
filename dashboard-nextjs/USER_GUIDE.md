# Qwery Dashboard - User Guide

Welcome to the Qwery Dashboard! This guide will help you understand what this website does and how to use it.

---

## What is Qwery Dashboard?

Qwery Dashboard is a web application that lets you manage your access to the Solana API. Think of it as your control panel for getting blockchain data from Solana.

---

## What Can You Do Here?

### 1. Connect Your Wallet
When you first visit the website, you'll see a "Connect Wallet" button. Click it to log in using your Phantom wallet (a Solana cryptocurrency wallet). This is how the website knows who you are - no passwords needed!

### 2. View Your Dashboard
After connecting your wallet, you'll see your personal dashboard. This shows:
- How many API requests you've made
- Charts showing your usage over time
- Quick links to manage your API keys

### 3. Create API Keys
API keys are like passwords that let your apps talk to the Solana blockchain through our service. To create one:
- Go to "API Keys" in the navigation menu
- Click the "+ New API Key" button
- Give your key a name (like "My App" or "Production Key")
- Click "Create API Key"
- IMPORTANT: Copy the key immediately and save it somewhere safe! You won't see it again.

### 4. Manage Your API Keys
On the API Keys page, you can:
- See all your API keys
- Copy them to use in your applications
- Delete keys you no longer need
- See how many times each key has been used

### 5. Read the Documentation
The Documentation page explains all the different API endpoints (URLs) you can use to get Solana blockchain data. Each endpoint shows:
- What it does
- What information you need to send
- Example code showing how to use it

---

## How to Use Your API Keys

Once you have an API key, you can use it to make requests to our API. Here's a simple example:

When making a request to our API, include your key in the header like this:
Header: X-API-Key: your_key_here

For example, to get token prices, you would send a request to:
https://api.qwery.xyz/api/v1/token-price

And include your API key in the request headers.

---

## Understanding the Pages

### Home Page
This is the landing page where you connect your wallet to get started.

### Dashboard
Your main control center showing your API usage statistics and quick access to other features.

### API Keys
Where you create and manage all your API keys. Each key can be used independently.

### Documentation
A complete reference guide showing all available API endpoints and how to use them.

---

## Tips for Using the Dashboard

1. **Save Your API Keys**: When you create a new key, copy it immediately. For security, we only show the full key once.

2. **Name Your Keys**: Give each key a descriptive name so you know which app or project it's for.

3. **Monitor Usage**: Check your dashboard regularly to see your API usage and make sure everything is working correctly.

4. **Delete Unused Keys**: If you stop using a key, delete it from the dashboard for better security.

5. **Keep Keys Secret**: Never share your API keys publicly or commit them to public code repositories (like GitHub).

---

## Understanding API Keys

### What is an API Key?
An API key is a unique identifier that lets you access our Solana API services. It's like a special code that proves you're allowed to use our service.

### Key Formats
All Qwery API keys start with "qwery_" followed by a long string of random characters.

Example: qwery_abc123xyz789...

### Full Key vs Prefix
- **Full Key**: The complete key you get when you first create it. This is what you use in your applications.
- **Prefix Only**: After creation, we only show the first part (prefix) of your key in the dashboard for security. The full key is stored securely in our database.

---

## Security & Best Practices

### Do's:
✅ Save your API keys in a secure location (password manager, environment variables)
✅ Use different keys for different projects
✅ Delete keys you're no longer using
✅ Monitor your usage for any unusual activity

### Don'ts:
❌ Share your API keys with others
❌ Post keys in public forums or social media
❌ Commit keys to public GitHub repositories
❌ Use the same key for everything

---

## Common Questions

### "I lost my API key, what do I do?"
If you lose an API key, you'll need to create a new one. For security reasons, we can't recover lost keys. Delete the old key and create a new one.

### "How many API keys can I create?"
You can create as many API keys as you need. There's no limit.

### "Can I rename an API key?"
Currently, you cannot rename an API key. If you need a different name, create a new key with the desired name and delete the old one.

### "What happens if I delete an API key?"
Once you delete a key, any applications using that key will stop working immediately. Make sure to update your applications with a new key before deleting the old one.

### "Why can't I see my full API key anymore?"
For security, we only show the full key once when you create it. After that, you'll only see a preview (the first few characters). This protects your key if someone looks at your screen.

---

## Getting Help

If you need assistance:

1. **Check the Documentation**: Most questions are answered in our API documentation page
2. **Join Discord**: Ask the community for help at discord.com/invite/qwerydotxyz
3. **Email Support**: Send an email to support@qwery.xyz
4. **Twitter**: Tweet at @qwerydotxyz

---

## Technical Requirements

To use this dashboard, you need:
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A Phantom wallet extension installed in your browser
- A Solana wallet address with some SOL (for wallet connection)
- Internet connection

---

## What Makes This Dashboard Special

### Dark Theme
The entire dashboard uses a true black theme that's easy on your eyes and perfect for OLED screens. It looks professional and saves battery on mobile devices.

### Wallet Authentication
No need to remember passwords! You log in using your Solana wallet, which is more secure and convenient.

### Real-Time Data
Your usage statistics and API key information updates in real-time, so you always see the latest information.

### Mobile Friendly
The dashboard works great on phones and tablets, not just computers.

---

## Next Steps

1. **Connect Your Wallet**: Click "Connect Wallet" on the home page
2. **Create Your First API Key**: Go to API Keys → New API Key
3. **Save Your Key**: Copy it and store it securely
4. **Read the Docs**: Check out the Documentation page to learn what you can do
5. **Start Building**: Use your API key in your applications to access Solana data

---

## Important Notes

- **Your wallet address is your identity**: We identify you by your Solana wallet address, not by email or username
- **API keys are stored locally**: Full keys are saved in your browser's local storage for convenience
- **Clear cache carefully**: If you clear your browser data, you might lose access to viewing your full API keys (though they'll still work)
- **Always stay logged in**: Keep your wallet connected while using the dashboard

---

## Understanding API Usage

When you make requests to our API using your key, we track:
- **Request Count**: How many times you've called our API
- **Last Used**: When your key was last used
- **Daily Usage**: A chart showing your usage over time

This helps you:
- Monitor your application's activity
- Detect any unusual patterns
- Plan for scaling your application

---

## Troubleshooting

### "Connect Wallet button doesn't work"
- Make sure Phantom wallet extension is installed
- Try refreshing the page
- Check if your wallet is unlocked

### "My API keys aren't showing up"
- Make sure you're connected with the same wallet you used to create them
- Try refreshing the page
- Check browser console for errors

### "I can't create a new API key"
- Ensure you're logged in (wallet connected)
- Check your internet connection
- Try refreshing and logging in again

### "Website is too dark/too bright"
- The website uses a dark theme by default
- This is optimized for OLED displays and reduces eye strain

---

That's it! You now know everything you need to use the Qwery Dashboard effectively. Happy building! 🚀

