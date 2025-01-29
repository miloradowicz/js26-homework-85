import mongoose from 'mongoose';
import { fakerEN } from '@faker-js/faker';

import config from './config';
import User from './models/User';
import Artist from './models/Artist';
import Album from './models/Album';
import Track from './models/Track';
import TrackHistory from './models/TrackHistory';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max + 1 - min) + min);

(async () => {
  await mongoose.connect(new URL(config.mongo.db, config.mongo.host).href);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users').catch(() => {
      console.log('skipping users...');
    });
    await db.dropCollection('artists').catch(() => {
      console.log('skipping artists...');
    });
    await db.dropCollection('albums').catch(() => {
      console.log('skipping albums...');
    });
    await db.dropCollection('tracks').catch(() => {
      console.log('skipping tracks...');
    });
    await db.dropCollection('trackhistories').catch(() => {
      console.log('skipping trackHistories');
    });

    const users = await User.create(
      {
        username: 'mealy_forager',
        password: '1111',
        role: 'admin',
      },
      {
        username: 'fantastic_presume',
        password: '2222',
      },
      {
        username: 'doting_thread',
        password: '3333',
      },
      {
        username: 'amused_possession',
        password: '4444',
      }
    );

    const [babymetal, eluveitie, dethklok, faun] = await Artist.create(
      {
        name: 'Babymetal',
        photoUrl: '_babymetal.jpg',
        description: 'Kawaii metal band from Japan',
        isPublished: true,
        publishedBy: users[0]._id,
      },
      {
        name: 'Eluveitie',
        photoUrl: '_eluveitie.jpg',
        description: 'Folk metal band from Switzerland',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        name: 'Dethklok',
        photoUrl: '_dethklok.jpg',
        description: 'Death metal band from the USA',
        isPublished: true,
        publishedBy: users[2]._id,
      },
      {
        name: 'Faun',
        photoUrl: '_faun.jpg',
        description: 'Folk rock band from Germany',
        isPublished: false,
        publishedBy: users[3]._id,
      }
    );

    const [
      babymetal_babymetal,
      babymetal_metalResistance,
      babymetal_metalGalaxy,
      eluveitie_spirit,
      eluveitie_slania,
      eluveitie_helvetios,
      dethklok_theDeathalbum,
      dethklok_deathalbum2,
      faun_eden,
      faun_luna,
      faun_midgard,
    ] = await Album.create(
      {
        title: 'Babymetal',
        artist: babymetal._id,
        year: 2014,
        coverUrl: '_babymetal_babymetal.jpg',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Metal Resistance',
        artist: babymetal._id,
        year: 2016,
        coverUrl: '_babymetal_metal-resistance.jpg',
        isPublished: true,
        publishedBy: users[0]._id,
      },
      {
        title: 'Metal Galaxy',
        artist: babymetal._id,
        year: 2019,
        coverUrl: '_babymetal_metal-galaxy.jpg',
        isPublished: true,
        publishedBy: users[0]._id,
      },
      {
        title: 'Spirit',
        artist: eluveitie._id,
        year: 2006,
        coverUrl: '_eluveitie_spirit.jpg',
        isPublished: true,
        publishedBy: users[0]._id,
      },
      {
        title: 'Slania',
        artist: eluveitie._id,
        year: 2008,
        coverUrl: '_eluveitie_slania.jpg',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Helvetios',
        artist: eluveitie._id,
        year: 2012,
        coverUrl: '_eluveitie_helvetios.jpg',
        isPublished: false,
        publishedBy: users[2]._id,
      },
      {
        title: 'The Deathalbum',
        artist: dethklok._id,
        year: 2007,
        coverUrl: '_dethklok_the-deathalbum.jpg',
        isPublished: true,
        publishedBy: users[2]._id,
      },
      {
        title: 'Deathalbum II',
        artist: dethklok._id,
        year: 2009,
        coverUrl: '_dethklok_deathalbum-ii.jpg',
        isPublished: true,
        publishedBy: users[2]._id,
      },
      {
        title: 'Eden',
        artist: faun._id,
        year: 2011,
        coverUrl: '_faun_eden.jpg',
        isPublished: true,
        publishedBy: users[2]._id,
      },
      {
        title: 'Luna',
        artist: faun._id,
        year: 2014,
        coverUrl: '_faun_luna.jpg',
        isPublished: true,
        publishedBy: users[3]._id,
      },
      {
        title: 'Midgard',
        artist: faun._id,
        year: 2016,
        coverUrl: '_faun_midgard.jpg',
        isPublished: true,
        publishedBy: users[3]._id,
      }
    );

    const tracks = await Track.create(
      {
        title: 'Light and Darkness',
        album: babymetal_babymetal._id,
        trackNum: 1,
        length: '5:46',
        youTubeUrl: 'https://www.youtube.com/watch?v=VavzD_bTov4',
        isPublished: true,
        publishedBy: users[0]._id,
      },
      {
        title: 'Megitsune',
        album: babymetal_babymetal._id,
        trackNum: 2,
        length: '4:07',
        isPublished: true,
        publishedBy: users[0]._id,
      },
      {
        title: 'Gimme Chocolate!!',
        album: babymetal_babymetal._id,
        trackNum: 3,
        length: '3:50',
        youTubeUrl: 'https://www.youtube.com/watch?v=WIKqgE4BwAY&pp=ygUZZ2ltbWUgY2hvY29sYXRlIGJhYnltZXRhbA%3D%3D',
        isPublished: true,
        publishedBy: users[0]._id,
      },
      {
        title: 'Iine!',
        album: babymetal_babymetal._id,
        trackNum: 4,
        length: '4:08',
        isPublished: true,
        publishedBy: users[0]._id,
      },
      {
        title: 'Akatsuki',
        album: babymetal_babymetal._id,
        trackNum: 5,
        length: '5:25',
        isPublished: true,
        publishedBy: users[0]._id,
      },
      {
        title: 'Road of Resistance',
        album: babymetal_metalResistance._id,
        trackNum: 1,
        length: '5:18',
        youTubeUrl: 'https://www.youtube.com/watch?v=zTEYUFgLveY&pp=ygUccm9hZCBvZiByZXNpc3RhbmNlIGJhYnltZXRhbA%3D%3D',
        isPublished: true,
        publishedBy: users[0]._id,
      },
      {
        title: 'Karate',
        album: babymetal_metalResistance._id,
        trackNum: 2,
        length: '4:23',
        isPublished: false,
        publishedBy: users[0]._id,
      },
      {
        title: 'Awadama Fever',
        album: babymetal_metalResistance._id,
        trackNum: 3,
        length: '4:13',
        isPublished: false,
        publishedBy: users[0]._id,
      },
      {
        title: 'Yava!',
        album: babymetal_metalResistance._id,
        trackNum: 4,
        length: '3:48',
        isPublished: false,
        publishedBy: users[0]._id,
      },
      {
        title: 'Amore',
        album: babymetal_metalResistance._id,
        trackNum: 5,
        length: '4:39',
        isPublished: true,
        publishedBy: users[0]._id,
      },
      {
        title: 'Future Metal',
        album: babymetal_metalGalaxy._id,
        trackNum: 1,
        length: '2:05',
        isPublished: true,
        publishedBy: users[0]._id,
      },
      {
        title: 'Da Da Dance',
        album: babymetal_metalGalaxy._id,
        trackNum: 2,
        length: '3:51',
        isPublished: true,
        publishedBy: users[0]._id,
      },
      {
        title: 'Elevator Girl',
        album: babymetal_metalGalaxy._id,
        trackNum: 3,
        length: '2:46',
        isPublished: true,
        publishedBy: users[0]._id,
      },
      {
        title: 'Shanti Shanti Shanti',
        album: babymetal_metalGalaxy._id,
        trackNum: 4,
        length: '3:10',
        isPublished: true,
        publishedBy: users[0]._id,
      },
      {
        title: 'Oh! Majinai',
        album: babymetal_metalGalaxy._id,
        trackNum: 5,
        length: '3:14',
        youTubeUrl: 'https://www.youtube.com/watch?v=wPJyz0KvudE&pp=ygULT2ghIE1hamluYWk%3D',
        isPublished: true,
        publishedBy: users[0]._id,
      },
      {
        title: 'Spirit',
        album: eluveitie_spirit._id,
        trackNum: 1,
        length: '2:32',
        youTubeUrl: 'https://www.youtube.com/watch?v=u3q6WWLufO8&pp=ygUQZWx1dmVpdGllIHNwaXJpdA%3D%3D',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'uis Elveti',
        album: eluveitie_spirit._id,
        trackNum: 2,
        length: '4:24',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Your Gaulish War',
        album: eluveitie_spirit._id,
        trackNum: 3,
        length: '5:11',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Of Fire, Wind & Wisdom',
        album: eluveitie_spirit._id,
        trackNum: 4,
        length: '3:05',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Samon',
        album: eluveitie_slania._id,
        trackNum: 5,
        length: '1:49',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Primordial Breath',
        album: eluveitie_slania._id,
        trackNum: 1,
        length: '4:19',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Inis Mona',
        album: eluveitie_slania._id,
        trackNum: 2,
        length: '4:09',
        youTubeUrl: 'https://www.youtube.com/watch?v=iijKLHCQw5o&pp=ygUTaW5pcyBtb25hIGVsdXZlaXRpZQ%3D%3D',
        isPublished: true,
        publishedBy: users[2]._id,
      },
      {
        title: 'Gray Sublime Archon',
        album: eluveitie_slania._id,
        trackNum: 3,
        length: '4:21',
        isPublished: true,
        publishedBy: users[2]._id,
      },
      {
        title: 'Anagantios',
        album: eluveitie_slania._id,
        trackNum: 4,
        length: '3:25',
        isPublished: true,
        publishedBy: users[2]._id,
      },
      {
        title: 'Prologue',
        album: eluveitie_helvetios._id,
        trackNum: 1,
        length: '1:24',
        isPublished: true,
        publishedBy: users[3]._id,
      },
      {
        title: 'Helvetios',
        album: eluveitie_helvetios._id,
        trackNum: 2,
        length: '4:00',
        youTubeUrl: 'https://www.youtube.com/watch?v=ohotq66c0ec&pp=ygUJaGVsdmV0aW9z',
        isPublished: true,
        publishedBy: users[3]._id,
      },
      {
        title: 'Luxtos',
        album: eluveitie_helvetios._id,
        trackNum: 3,
        length: '3:56',
        isPublished: true,
        publishedBy: users[2]._id,
      },
      {
        title: 'Home',
        album: eluveitie_helvetios._id,
        trackNum: 4,
        length: '5:16',
        isPublished: true,
        publishedBy: users[3]._id,
      },
      {
        title: 'Santonian Shores',
        album: eluveitie_helvetios._id,
        trackNum: 5,
        length: '3:58',
        isPublished: true,
        publishedBy: users[2]._id,
      },

      {
        title: 'Murmaider',
        album: dethklok_theDeathalbum._id,
        trackNum: 1,
        length: '3:24',
        youTubeUrl: 'https://www.youtube.com/watch?v=r-eKJIJXaqE&pp=ygUIZGV0aGtsb2s%3D',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Go into the Water',
        album: dethklok_theDeathalbum._id,
        trackNum: 2,
        length: '4:20',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Awaken',
        album: dethklok_theDeathalbum._id,
        trackNum: 3,
        length: '3:37',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Bloodrocuted',
        album: dethklok_theDeathalbum._id,
        trackNum: 4,
        length: '2:18',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Go Forth and Die',
        album: dethklok_theDeathalbum._id,
        trackNum: 5,
        length: '4:22',
        youTubeUrl: 'https://www.youtube.com/watch?v=zKlf6oay4FA&pp=ygUQZ28gZm9ydGggYW5kIGRpZQ%3D%3D',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Bloodlines',
        album: dethklok_deathalbum2._id,
        trackNum: 1,
        length: '3:30',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'The Gears',
        album: dethklok_deathalbum2._id,
        trackNum: 2,
        length: '4:21',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Burn the Earth',
        album: dethklok_deathalbum2._id,
        trackNum: 3,
        length: '3:59',
        youTubeUrl: 'https://www.youtube.com/watch?v=DmVkkkuZLeU&pp=ygUXZGV0aGtsb2sgYnVybiB0aGUgZWFydGg%3D',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Laser Cannon Death Sentence',
        album: dethklok_deathalbum2._id,
        trackNum: 4,
        length: '4:35',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Black Fire Upon Us',
        album: dethklok_deathalbum2._id,
        trackNum: 5,
        length: '5:40',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Feuer',
        album: faun_eden._id,
        trackNum: 1,
        length: '3:15',
        youTubeUrl: 'https://www.youtube.com/watch?v=-J4AuEj4zHE',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Walpurgisnacht',
        album: faun_eden._id,
        trackNum: 2,
        length: '4:02',
        youTubeUrl: 'https://www.youtube.com/watch?v=nLgM1QJ3S_I',
        isPublished: true,
        publishedBy: users[1]._id,
      },
      {
        title: 'Galdra',
        album: faun_eden._id,
        trackNum: 3,
        length: '3:21',
        youTubeUrl: 'https://www.youtube.com/watch?v=1lFjnlf--Jw',
        isPublished: true,
        publishedBy: users[3]._id,
      },
      {
        title: 'The Butterfly',
        album: faun_eden._id,
        trackNum: 4,
        length: '1:33',
        isPublished: true,
        publishedBy: users[3]._id,
      },
      {
        title: 'Adam Lay Yboundun',
        album: faun_eden._id,
        trackNum: 5,
        length: '4:36',
        isPublished: true,
        publishedBy: users[3]._id,
      },
      {
        title: 'Luna Prolog',
        album: faun_luna._id,
        trackNum: 1,
        length: '1:25',
        isPublished: true,
        publishedBy: users[3]._id,
      },
      {
        title: 'Walpurgisnacht',
        album: faun_luna._id,
        trackNum: 2,
        length: '3:49',
        youTubeUrl: 'https://www.youtube.com/watch?v=nLgM1QJ3S_I',
        isPublished: true,
        publishedBy: users[3]._id,
      },
      {
        title: 'Brutes Volk',
        album: faun_luna._id,
        trackNum: 3,
        length: '4:16',
        isPublished: true,
        publishedBy: users[3]._id,
      },
      {
        title: 'Menuett',
        album: faun_luna._id,
        trackNum: 4,
        length: '4:56',
        isPublished: true,
        publishedBy: users[2]._id,
      },
      {
        title: 'Hekate',
        album: faun_luna._id,
        trackNum: 5,
        length: '4:15',
        isPublished: true,
        publishedBy: users[2]._id,
      },
      {
        title: 'Midgard Prolog',
        album: faun_midgard._id,
        trackNum: 1,
        length: '0:50',
        isPublished: true,
        publishedBy: users[2]._id,
      },
      {
        title: 'Federkleid',
        album: faun_midgard._id,
        trackNum: 2,
        length: '4:42',
        youTubeUrl: 'https://www.youtube.com/watch?v=zOvsyamoEDg&pp=ygUPZmVkZXJrbGVpZCBmYXVu',
        isPublished: true,
        publishedBy: users[2]._id,
      },
      {
        title: 'Sonnenreigen (Luchnasad)',
        album: faun_midgard._id,
        trackNum: 3,
        length: '3:54',
        isPublished: true,
        publishedBy: users[2]._id,
      },
      {
        title: 'Alba II Intro',
        album: faun_midgard._id,
        trackNum: 4,
        length: '1:50',
        isPublished: true,
        publishedBy: users[2]._id,
      },
      {
        title: 'Alba II',
        album: faun_midgard._id,
        trackNum: 5,
        length: '6:10',
        isPublished: true,
        publishedBy: users[2]._id,
      }
    );

    const rndTrack = () => tracks[randomInt(0, tracks.length - 1)];
    const rndUser = () => users[randomInt(0, users.length - 1)];
    const rndDate = () =>
      new Date(
        2020 + randomInt(0, 4),
        randomInt(1, 11),
        randomInt(0, 31),
        randomInt(0, 23),
        randomInt(0, 59),
        randomInt(0, 59)
      );

    await TrackHistory.create(
      ...Array.from({ length: 100 }, () => ({
        track: rndTrack()._id,
        user: rndUser()._id,
        date: rndDate(),
      }))
    );
  } catch (e) {
    console.error(e);
  } finally {
    await db.close();
  }
})()
  .then(() => console.log('fixtures created'))
  .catch(console.error);
