import Image from 'next/image'

export default function RankInfo() {
  const ranks = [
    {
      name: 'Rookie',
      description: 'Just starting out? Welcome to the community!',
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/gamegrid-f4689.appspot.com/o/files%2FRookie.png?alt=media&token=033466a9-eb0c-4c91-bd24-e0c248769f42',
    },
    {
      name: 'Adventurer',
      description: "You've begun to find your footing.",
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/gamegrid-f4689.appspot.com/o/files%2FAdventurer.png?alt=media&token=b26dab46-a32f-4b30-9134-60c9631ee71f',
    },
    {
      name: 'Veteran',
      description: "You're actively engaging with the community.",
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/gamegrid-f4689.appspot.com/o/files%2FVeteran.png?alt=media&token=4617a7d8-e98f-4d3f-aa7f-ba20869142fb',
    },
    {
      name: 'Epic',
      description: 'Your experience is starting to show.',
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/gamegrid-f4689.appspot.com/o/files%2FEpic.png?alt=media&token=2f91e723-173a-4a0a-a054-02b8fef42f51',
    },
    {
      name: 'Elite',
      description: "You've become a recognized and respected member.",
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/gamegrid-f4689.appspot.com/o/files%2FElite.png?alt=media&token=10fd2fc6-af7f-4bcf-80db-b5c8110c7284',
    },
    {
      name: 'Mythic',
      description: 'Your contributions are legendary.',
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/gamegrid-f4689.appspot.com/o/files%2FMythic.png?alt=media&token=85f03ef5-aaa5-48e5-b7ea-06ea104c13a1',
    },
    {
      name: 'Immortal',
      description: 'The pinnacle of achievement, reserved for the most dedicated gamers.',
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/gamegrid-f4689.appspot.com/o/files%2FImmortal.png?alt=media&token=ca033135-920c-4f4e-88c3-998cce5d6803',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 pl-20">
      {/* תוכן ה-div שלך */}

      <h1 className="text-4xl font-bold text-center mb-6 text-white">Explanation of the RANK system</h1>
      <p className="text-lg text-center mb-8 max-w-2xl text-white">
        At GameGrid, we believe that recognition for your achievements is key to a rewarding gaming
        experience. Our Rank System is designed to celebrate your journey as you engage with the platform,
        connect with fellow gamers, and share your gaming milestones.
      </p>
      <h2 className="text-4xl font-bold text-center mb-6 text-white">How can I get points?</h2>
      <p className="text-lg text-center mb-8 max-w-2xl text-white">
        The GameGrid Rank System is a dynamic, points-based system that rewards you for various activities on
        the platform. Each action you take, whether it's posting, liking, sharing, or engaging with other
        users, earns you points. As you accumulate points, your rank increases, showcasing your status in the
        GameGrid community.
      </p>

      <h3 className="text-3xl font-semibold mb-4 text-white">Ranks and Levels</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {ranks.map((rank) => (
          <div key={rank.name} className="bg-slate-300 shadow-lg rounded-lg p-6 flex flex-col items-center">
            <Image src={rank.imageUrl} alt={rank.name} width={100} height={100} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">{rank.name}</h3>
            <p className="text-center text-gray-700">{rank.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
