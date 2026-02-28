export const siteConfig = {
  name: "Vijay Pratap",
  tagline: "I love writing and writing loves me",
  description: "Filmmaker, writer, cyclist, and recovering data scientist. Exploring stories through every medium I can find.",
  url: "https://vijaypratap.com",

  social: {
    email: "hello@vijaypratap.com",
    instagram: "https://instagram.com/vijaypratap",
    youtube: "https://youtube.com/@vijaypratap",
    linkedin: "https://linkedin.com/in/vijaypratap",
  },

  about: {
    headline: "Stories find me. I give them shape.",
    paragraphs: [
      "I'm Vijay Pratap — a filmmaker, writer, and someone who believes that the best stories are the ones you stumble into by accident.",
      "I started my career in data science, building models and algorithms. Somewhere along the way, I realized I was more interested in the stories behind the data than the data itself. So I picked up a camera, started writing, and never looked back.",
      "When I'm not writing or shooting, you'll find me on a bicycle somewhere in the mountains, trying to outrun my own thoughts. It rarely works, but the views are worth it.",
      "This site is a collection of everything I make — screenplays, films, essays, cycling journals, and the occasional data science piece for old times' sake. It's messy and eclectic, much like the person behind it.",
    ],
    portrait: "/images/vijay-portrait.jpg",
  },

  categories: [
    { id: "writings", label: "Writings", description: "Screenplays, stories, and everything in between" },
    { id: "films", label: "Films", description: "Documentaries, shorts, and visual experiments" },
    { id: "cycling", label: "Cycling", description: "Two wheels, open roads, and bad decisions" },
    { id: "road-to-wisdom", label: "Road to Wisdom", description: "Essays, reflections, and things I'm figuring out" },
    { id: "data-science", label: "Data Science", description: "The life I left behind (mostly)" },
    { id: "books", label: "Books", description: "Reviews, notes, and books that changed me" },
    { id: "posters", label: "Posters", description: "Visual experiments and poster designs" },
  ],
} as const;

export type Category = typeof siteConfig.categories[number]['id'];
