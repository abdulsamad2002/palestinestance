const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  title: String,
  organization: String,
  leaders: [{ name: String, role: String }],
  location: String,
  date: String,
  description: String,
  impact: String,
  sources: [String],
  status: String
});

const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;

  await mongoose.connect(MONGODB_URI);

  const campaigns = [
    {
      title: "Global Day of Action for Gaza",
      organization: "Palestine Solidarity Campaign (PSC)",
      leaders: [
        { name: "Ben Jamal", role: "Director of PSC" },
        { name: "Mustafa Barghouti", role: "Political Leader" }
      ],
      location: "London, UK (Global)",
      date: "October 2023 - Present",
      description: "One of the largest coordinated protest movements in history, with millions marching across London, Washington D.C., and 100+ cities worldwide calling for an immediate ceasefire.",
      impact: "800,000+ marchers in London alone",
      sources: ["https://www.palestinesolidaritycampaign.org/", "https://www.bbc.com/news/uk-67384218"],
      status: "ongoing"
    },
    {
      title: "Artists For Palestine UK",
      organization: "Artists for Palestine UK",
      leaders: [
        { name: "Brian Eno", role: "Artist & Activist" },
        { name: "Ken Loach", role: "Filmmaker" }
      ],
      location: "United Kingdom",
      date: "Ongoing",
      description: "A growing network of over 4,000 artists, including actors and musicians, who have pledged to uphold a cultural boycott of Israel and support Palestinian rights.",
      impact: "4,000+ artist signatures",
      sources: ["https://artistsforpalestine.org.uk/"],
      status: "active"
    }
  ];

  await Campaign.deleteMany({});
  await Campaign.insertMany(campaigns);

  console.log('Campaigns seeded successfully!');
  process.exit(0);
}

seed();
