import { Poem, Mood } from '@/types';
import { getPoetById } from './poets';

const createPoem = (
  id: string,
  title: string,
  text: string,
  poetId: string,
  moods: Mood[],
  originalLanguage: string = 'English',
  culturalContext?: string,
  translatedText?: string
): Poem => {
  const poet = getPoetById(poetId)!;
  return {
    id,
    title,
    text,
    poetId,
    poet,
    originalLanguage,
    translatedText,
    moods,
    country: poet.country,
    countryCode: poet.countryCode,
    culturalContext,
    lineCount: text.split('\n').filter(line => line.trim()).length,
  };
};

export const poems: Poem[] = [
  createPoem(
    'guest-house',
    'The Guest House',
    `This being human is a guest house.
Every morning a new arrival.

A joy, a depression, a meanness,
some momentary awareness comes
as an unexpected visitor.

Welcome and entertain them all!
Even if they're a crowd of sorrows,
who violently sweep your house
empty of its furniture,
still, treat each guest honorably.
He may be clearing you out
for some new delight.

The dark thought, the shame, the malice,
meet them at the door laughing,
and invite them in.

Be grateful for whoever comes,
because each has been sent
as a guide from beyond.`,
    'rumi',
    ['healing', 'hope', 'calm'],
    'Persian',
    'This poem reflects the Sufi concept of accepting all emotions as teachers, a central theme in Rumi\'s work.'
  ),
  createPoem(
    'hope-feathers',
    'Hope is the thing with feathers',
    `"Hope" is the thing with feathers -
That perches in the soul -
And sings the tune without the words -
And never stops - at all -

And sweetest - in the Gale - is heard -
And sore must be the storm -
That could abash the little Bird
That kept so many warm -

I've heard it in the chillest land -
And on the strangest Sea -
Yet - never - in Extremity,
It asked a crumb - of me.`,
    'emily-dickinson',
    ['hope', 'calm'],
    'English',
    'Dickinson\'s use of dashes creates a distinctive rhythm, mirroring the persistent flutter of hope.'
  ),
  createPoem(
    'tonight-write',
    'Tonight I Can Write',
    `Tonight I can write the saddest lines.

Write, for example, 'The night is starry
and the stars are blue and shiver in the distance.'

The night wind revolves in the sky and sings.

Tonight I can write the saddest lines.
I loved her, and sometimes she loved me too.

Through nights like this one I held her in my arms.
I kissed her again and again under the endless sky.

She loved me, sometimes I loved her too.
How could one not have loved her great still eyes.

Tonight I can write the saddest lines.
To think that I do not have her. To feel that I have lost her.

To hear the immense night, still more immense without her.
And the verse falls to the soul like dew to the pasture.`,
    'pablo-neruda',
    ['sad', 'love', 'melancholy'],
    'Spanish',
    'Part of Neruda\'s "Twenty Love Poems and a Song of Despair," this poem captures the universal ache of lost love.'
  ),
  createPoem(
    'old-pond',
    'The Old Pond',
    `An old silent pond...
A frog jumps into the pond—
Splash! Silence again.`,
    'matsuo-basho',
    ['calm', 'melancholy'],
    'Japanese',
    'This haiku exemplifies the Zen concept of finding profound meaning in simple, fleeting moments.'
  ),
  createPoem(
    'wild-geese',
    'Wild Geese',
    `You do not have to be good.
You do not have to walk on your knees
for a hundred miles through the desert, repenting.
You only have to let the soft animal of your body
love what it loves.
Tell me about despair, yours, and I will tell you mine.
Meanwhile the world goes on.
Meanwhile the sun and the clear pebbles of the rain
are moving across the landscapes,
over the prairies and the deep trees,
the mountains and the rivers.
Meanwhile the wild geese, high in the clean blue air,
are heading home again.
Whoever you are, no matter how lonely,
the world offers itself to your imagination,
calls to you like the wild geese, harsh and exciting—
over and over announcing your place
in the family of things.`,
    'mary-oliver',
    ['healing', 'hope', 'calm'],
    'English',
    'Oliver\'s poem offers radical acceptance, suggesting our place in nature needs no justification.'
  ),
  createPoem(
    'i-wish',
    'I Wish I Could Show You',
    `I wish I could show you
when you are lonely or in darkness
the astonishing light of your own being.`,
    'hafez',
    ['hope', 'love', 'healing'],
    'Persian',
    'Hafez often wrote about the divine light within each person, a core Sufi teaching.'
  ),
  createPoem(
    'we-will-meet',
    'We Will Meet Again',
    `We will meet again, in Petersburg,
as if we had buried the sun there,
and for the first time we will utter
the blessed, the senseless word.

In the Soviet night's black velvet,
in the velvet of world-wide emptiness,
the dear eyes of the blessed women still sing,
the immortal flowers still bloom.`,
    'anna-akhmatova',
    ['melancholy', 'hope', 'love'],
    'Russian',
    'Written during the Soviet era, this poem carries the weight of separation and the hope for reunion.'
  ),
  createPoem(
    'dreams',
    'Dreams',
    `Hold fast to dreams
For if dreams die
Life is a broken-winged bird
That cannot fly.

Hold fast to dreams
For when dreams go
Life is a barren field
Frozen with snow.`,
    'langston-hughes',
    ['hope', 'sad', 'healing'],
    'English',
    'Hughes wrote during the Harlem Renaissance, infusing his work with the dreams and struggles of Black America.'
  ),
  createPoem(
    'nothing-twice',
    'Nothing Twice',
    `Nothing can ever happen twice.
In consequence, the sorry fact is
that we arrive here improvised
and leave without the chance to practice.

Even if there is no one dumber,
if you're the planet's biggest dunce,
you can't repeat the class in summer:
this course is offered only once.`,
    'wislawa-szymborska',
    ['calm', 'melancholy', 'hope'],
    'Polish',
    'Szymborska\'s philosophical wit shines through, reminding us of life\'s unrepeatable nature.'
  ),
  createPoem(
    'where-mind-without-fear',
    'Where the Mind is Without Fear',
    `Where the mind is without fear
and the head is held high;
Where knowledge is free;
Where the world has not been broken up
into fragments by narrow domestic walls;
Where words come out from the depth of truth;
Where tireless striving stretches its arms towards perfection;
Where the clear stream of reason has not lost its way
into the dreary desert sand of dead habit;
Where the mind is led forward by thee
into ever-widening thought and action—
Into that heaven of freedom, my Father,
let my country awake.`,
    'rabindranath-tagore',
    ['hope', 'healing'],
    'Bengali',
    'Written before Indian independence, this poem envisions a nation free from both colonial and internal oppressions.'
  ),
  createPoem(
    'autumn-moon',
    'Autumn Moon',
    `The autumn moon
floats in the sky;
Watching it,
I know that I
am a traveler in this world.`,
    'matsuo-basho',
    ['melancholy', 'calm'],
    'Japanese',
    'Bashō\'s haiku captures the transient nature of existence through the image of the floating moon.'
  ),
  createPoem(
    'after-great-pain',
    'After great pain',
    `After great pain, a formal feeling comes –
The Nerves sit ceremonious, like Tombs –
The stiff Heart questions 'was it He, that bore,'
And 'Yesterday, or Centuries before'?

The Feet, mechanical, go round –
A Wooden way
Of Ground, or Air, or Ought –
Regardless grown,
A Quartz contentment, like a stone –

This is the Hour of Lead –
Remembered, if outlived,
As Freezing persons, recollect the Snow –
First – Chill – then Stupor – then the letting go –`,
    'emily-dickinson',
    ['sad', 'melancholy', 'healing'],
    'English',
    'Dickinson captures the numbing aftermath of grief with surgical precision.'
  ),
  createPoem(
    'the-journey',
    'The Journey',
    `One day you finally knew
what you had to do, and began,
though the voices around you
kept shouting
their bad advice—
though the whole house
began to tremble
and you felt the old tug
at your ankles.
"Mend my life!"
each voice cried.
But you didn't stop.
You knew what you had to do,
though the wind pried
with its stiff fingers
at the very foundations,
though their melancholy
was terrible.
It was already late
enough, and a wild night,
and the road full of fallen
branches and stones.
But little by little,
as you left their voices behind,
the stars began to burn
through the sheets of clouds,
and there was a new voice
which you slowly
recognized as your own,
that kept you company
as you strode deeper and deeper
into the world,
determined to do
the only thing you could do—
determined to save
the only life you could save.`,
    'mary-oliver',
    ['healing', 'hope'],
    'English',
    'Oliver\'s poem about self-discovery and the courage to follow one\'s own path.'
  ),
  createPoem(
    'home',
    'Home',
    `No one leaves home unless
home is the mouth of a shark.
You only run for the border
when you see the whole city
running as well.

Your neighbors running faster
than you, breath bloody in their throats.
The boy you went to school with
who kissed you dizzy behind
the old tin factory
is holding a gun bigger than his body.

You only leave home
when home won't let you stay.`,
    'warsan-shire',
    ['sad', 'hope', 'reflection'],
    'Somali',
    'Warsan Shire\'s powerful verse on displacement and the refugee experience, from "Teaching My Mother How to Give Birth."'
  ),
  createPoem(
    'conversations-about-home',
    'Conversations About Home (at the Deportation Centre)',
    `Well, I think home spat me out,
the blackouts and curfews like tongue against loose tooth.
Once, a woman told me that my home was not her home.

We are our mother\'s homes,
the first country we knew.
We carry our borders like skin.`,
    'warsan-shire',
    ['melancholy', 'longing', 'reflection'],
    'Somali',
    'A meditation on belonging and identity from one of contemporary poetry\'s most important voices on migration.'
  ),
  createPoem(
    'deelley',
    'Deelley (The World)',
    `The world is a garden,
if you tend it with love.
The world is a mirror,
reflecting what you give.

Do not curse the darkness,
light a candle instead.
Do not weep for yesterday,
build tomorrow with your hands.`,
    'hadraawi',
    ['hope', 'healing', 'calm'],
    'Somali',
    'Hadraawi, the "Shakespeare of Somalia," was known for poetry that combined lyrical beauty with profound wisdom.'
  ),
  createPoem(
    'siinley',
    'Siinley (The Beloved)',
    `You are the rain after drought,
the shade beneath scorching sun.
You are the well in the desert,
where weary travelers come.

In your eyes I see oceans,
in your voice I hear home.
You are my compass, my North Star,
wherever I may roam.`,
    'hadraawi',
    ['love', 'longing'],
    'Somali',
    'A love poem from Somalia\'s most celebrated poet, showcasing the nomadic imagery central to Somali verse.'
  ),
  createPoem(
    'telephone-conversation',
    'Telephone Conversation',
    `The price seemed reasonable, location
Indifferent. The landlady swore she lived
Off premises. Nothing remained
But self-confession. "Madam," I warned,
"I hate a wasted journey—I am African."

Silence. Silenced transmission of
Pressurized good-breeding. Voice, when it came,
Lipstick coated, long gold-rolled
Cigarette-holder pipped.`,
    'wole-soyinka',
    ['reflection', 'sad'],
    'English',
    'Soyinka\'s satirical poem confronting racism with wit and dignity.'
  ),
  createPoem(
    'abiku',
    'Abiku',
    `In vain your bangles cast
Charmed circles at my feet.
I am Abiku, calling for the first
And the repeated time.

Must I weep for goats and cowries
For palm oil and the sprinkled ash?
Yam do I need for travel, not to appease
The survey of your eyes.`,
    'wole-soyinka',
    ['melancholy', 'reflection'],
    'English',
    'Drawing on Yoruba mythology, this poem explores the cycle of life and death through the spirit child.'
  ),
  createPoem(
    'on-love',
    'On Love',
    `Love gives naught but itself
and takes naught but from itself.
Love possesses not nor would it be possessed;
For love is sufficient unto love.

When you love you should not say,
"God is in my heart," but rather,
"I am in the heart of God."
And think not you can direct the course of love,
for love, if it finds you worthy,
directs your course.`,
    'khalil-gibran',
    ['love', 'calm', 'hope'],
    'Arabic',
    'From "The Prophet," Gibran\'s most famous work, exploring love as a spiritual force.'
  ),
  createPoem(
    'on-children',
    'On Children',
    `Your children are not your children.
They are the sons and daughters of Life\'s longing for itself.
They come through you but not from you,
And though they are with you yet they belong not to you.

You may give them your love but not your thoughts,
For they have their own thoughts.
You may house their bodies but not their souls,
For their souls dwell in the house of tomorrow.`,
    'khalil-gibran',
    ['love', 'reflection', 'hope'],
    'Arabic',
    'A timeless meditation on parenthood and the nature of life from "The Prophet."'
  ),
  createPoem(
    'damascus',
    'Damascus',
    `Damascus, you remain in my heart
like a rose pressed in a book.
I carry you wherever I go,
your jasmine scent in every breath.

Your ancient stones remember
what we have forgotten.
Your rivers still flow
through my exile dreams.`,
    'nizar-qabbani',
    ['longing', 'melancholy', 'love'],
    'Arabic',
    'Qabbani\'s love letter to his homeland, written from exile.'
  ),
  createPoem(
    'i-love-you',
    'I Love You',
    `I love you
without knowing how,
or when, or from where.
I love you simply,
without problems or pride.

I love you in this way
because I do not know
any other way of loving.`,
    'nizar-qabbani',
    ['love', 'calm'],
    'Arabic',
    'One of the Arab world\'s most beloved love poems, known for its simplicity and depth.'
  ),
  createPoem(
    'lake-isle',
    'The Lake Isle of Innisfree',
    `I will arise and go now, and go to Innisfree,
And a small cabin build there, of clay and wattles made;
Nine bean-rows will I have there, a hive for the honey-bee,
And live alone in the bee-loud glade.

And I shall have some peace there, for peace comes dropping slow,
Dropping from the veils of the morning to where the cricket sings;
There midnight\'s all a glimmer, and noon a purple glow,
And evening full of the linnet\'s wings.`,
    'william-butler-yeats',
    ['calm', 'longing', 'hope'],
    'English',
    'Yeats\' iconic poem of longing for a simpler life, inspired by Thoreau and Irish mythology.'
  ),
  createPoem(
    'second-coming',
    'The Second Coming',
    `Turning and turning in the widening gyre
The falcon cannot hear the falconer;
Things fall apart; the centre cannot hold;
Mere anarchy is loosed upon the world.

The blood-dimmed tide is loosed, and everywhere
The ceremony of innocence is drowned;
The best lack all conviction, while the worst
Are full of passionate intensity.`,
    'william-butler-yeats',
    ['melancholy', 'reflection'],
    'English',
    'Written after World War I, this prophetic poem remains hauntingly relevant.'
  ),
  createPoem(
    'autopsychography',
    'Autopsychography',
    `The poet is a faker
Who\'s so good at his act
He even fakes the pain
Of pain he feels in fact.

And those who read his words
Will feel in his writing
Neither of the pains he has
But just the one they\'re missing.`,
    'fernando-pessoa',
    ['melancholy', 'reflection'],
    'Portuguese',
    'Pessoa\'s meditation on the nature of poetic truth and the masks we wear.'
  ),
  createPoem(
    'tobacco-shop',
    'The Tobacco Shop',
    `I\'m nothing.
I\'ll always be nothing.
I can\'t want to be something.
But I have in me all the dreams of the world.

Windows of my room,
The room of one of the world\'s millions nobody knows
(And if they knew me, what would they know?),
You open onto the mystery of a street.`,
    'fernando-pessoa',
    ['melancholy', 'calm', 'reflection'],
    'Portuguese',
    'One of Pessoa\'s most celebrated poems, exploring existential themes through everyday imagery.'
  ),
  createPoem(
    'spring-rain',
    'Spring Rain',
    `Spring rain—
under trees, a child
alone with her song.`,
    'matsuo-basho',
    ['calm', 'melancholy'],
    'Japanese',
    'Another masterful haiku capturing a quiet moment of childhood innocence.'
  ),
  createPoem(
    'summer-grass',
    'Summer Grass',
    `Summer grasses—
all that remains
of warriors\' dreams.`,
    'matsuo-basho',
    ['melancholy', 'reflection'],
    'Japanese',
    'Bashō\'s reflection on impermanence, written at an ancient battlefield.'
  ),
  createPoem(
    'still-rise',
    'Still I Rise',
    `You may write me down in history
With your bitter, twisted lies,
You may trod me in the very dirt
But still, like dust, I\'ll rise.

Does my sassiness upset you?
Why are you beset with gloom?
\'Cause I walk like I\'ve got oil wells
Pumping in my living room.`,
    'maya-angelou',
    ['hope', 'healing'],
    'English',
    'Maya Angelou\'s powerful anthem of resilience and dignity in the face of oppression.'
  ),
  // CHINESE POEMS
  createPoem(
    'quiet-night-thought',
    'Quiet Night Thought',
    `Before my bed, the moon is shining bright,
I think that it is frost upon the ground.
I raise my head and look at the bright moon,
I lower my head and think of home.`,
    'li-bai',
    ['melancholy', 'longing'],
    'Chinese',
    'One of the most famous Chinese poems, expressing homesickness.'
  ),
  createPoem(
    'spring-view',
    'Spring View',
    `The nation is broken, mountains and rivers remain.
Spring in the city—grass and trees grow deep.
Feeling the times, flowers draw tears;
Hating separation, birds alarm the heart.`,
    'du-fu',
    ['sad', 'melancholy'],
    'Chinese',
    'A reflection on war and the endurance of nature.'
  ),
  // KOREAN POEMS
  createPoem(
    'counting-stars',
    'Counting the Stars at Night',
    `Season of falling leaves, sky full of stars.
Like memories filling my heart,
I count them one by one.
But why can I not count them all?

For one star, memory.
For one star, love.
For one star, loneliness.`,
    'yun-dong-ju',
    ['melancholy', 'longing', 'hope'],
    'Korean',
    'A meditation on identity and hope under occupation.'
  ),
  // PAKISTANI/URDU POEMS
  createPoem(
    'speak',
    'Speak',
    `Speak, for your lips are free;
Speak, your tongue is still your own;
This straight body still is yours—
Speak, your life is still your own.

Look how in the blacksmith\'s forge
The flames leap high and the iron glows red.`,
    'faiz-ahmed-faiz',
    ['hope', 'reflection'],
    'Urdu',
    'A call for freedom of expression during difficult times.'
  ),
  createPoem(
    'thousand-desires',
    'A Thousand Desires',
    `A thousand desires, each worth dying for—
Many were satisfied, yet many remain.
We have known the pain of existence,
Or else we would have departed long ago.`,
    'mirza-ghalib',
    ['melancholy', 'reflection'],
    'Urdu',
    'A meditation on desire and the human condition.'
  ),
  // TURKISH POEMS
  createPoem(
    'on-living',
    'On Living',
    `Living is no laughing matter:
you must live with great seriousness
like a squirrel, for example—
I mean without looking for something beyond and above living,
I mean living must be your whole occupation.`,
    'nazim-hikmet',
    ['hope', 'reflection'],
    'Turkish',
    'An ode to embracing life fully.'
  ),
  // PALESTINIAN POEMS
  createPoem(
    'think-of-others',
    'Think of Others',
    `As you prepare your breakfast, think of others.
Don\'t forget to feed the pigeons.

As you wage your wars, think of others.
Don\'t forget those who seek peace.

As you return home, your home, think of others.
Don\'t forget those who live in tents.`,
    'mahmoud-darwish',
    ['reflection', 'hope', 'sad'],
    'Arabic',
    'A call for empathy and awareness of others\' suffering.'
  ),
  // MORE PERSIAN POEMS
  createPoem(
    'human-beings',
    'Human Beings',
    `Human beings are members of a whole,
In creation of one essence and soul.

If one member is afflicted with pain,
Other members uneasy will remain.

If you have no sympathy for human pain,
The name of human you cannot retain.`,
    'saadi',
    ['hope', 'healing', 'reflection'],
    'Persian',
    'A poem about human unity and compassion.'
  ),
  createPoem(
    'moving-finger',
    'The Moving Finger',
    `The Moving Finger writes; and, having writ,
Moves on: nor all thy Piety nor Wit
Shall lure it back to cancel half a Line,
Nor all thy Tears wash out a Word of it.`,
    'khayyam',
    ['melancholy', 'reflection'],
    'Persian',
    'A meditation on fate and the irreversibility of time.'
  ),
  // MORE JAPANESE HAIKU
  createPoem(
    'spring-sea',
    'Spring Sea',
    `Spring sea—
swaying gently
all day long.`,
    'matsuo-basho',
    ['calm'],
    'Japanese',
    'Capturing the gentle rhythm of the spring ocean.'
  ),
  createPoem(
    'o-snail',
    'O Snail',
    `O snail,
Climb Mount Fuji
But slowly, slowly!`,
    'matsuo-basho',
    ['hope', 'calm'],
    'Japanese',
    'A gentle encouragement to take life at one\'s own pace.'
  ),
  createPoem(
    'world-of-dew',
    'The World of Dew',
    `This world of dew
is a world of dew,
and yet, and yet...`,
    'matsuo-basho',
    ['sad', 'melancholy'],
    'Japanese',
    'Expressing Buddhist impermanence with deep feeling.'
  ),
  // MORE SOMALI POEMS
  createPoem(
    'the-sea-poem',
    'The Sea',
    `The sea knows no borders,
It embraces all shores equally.
Like love, it ebbs and flows,
Never forgetting to return.

The waves speak wisdom
To those who listen.`,
    'hadraawi',
    ['calm', 'reflection'],
    'Somali',
    'Natural imagery conveying deep philosophical truths.'
  ),
  createPoem(
    'exile-poem',
    'Exile',
    `I carry my country in my heart,
A weight that never lightens.
Every sunset reminds me
Of the one I left behind.

But the heart is large,
It can hold two homes.`,
    'warsan-shire',
    ['longing', 'sad', 'hope'],
    'Somali',
    'Giving voice to the diaspora experience.'
  ),
  createPoem(
    'blessing-poem',
    'Blessing',
    `May you find peace in the morning light,
May your path be clear and your heart be light.
May the ancestors guide your steps,
And may you never walk alone.`,
    'hadraawi',
    ['hope', 'calm', 'healing'],
    'Somali',
    'A traditional Somali blessing in poetic form.'
  ),
  // MORE INDIAN POEMS
  createPoem(
    'unending-love',
    'Unending Love',
    `I seem to have loved you in numberless forms,
numberless times,
In life after life,
In age after age, forever.

My spellbound heart has made
and remade the necklace of songs.`,
    'rabindranath-tagore',
    ['love', 'longing'],
    'Bengali',
    'A timeless expression of eternal love across lifetimes.'
  ),
  createPoem(
    'clouds-and-waves',
    'Clouds and Waves',
    `Mother, the folk who live up in the clouds call out to me—
"We play from the time we wake till the day ends.
We play with the golden dawn, we play with the silver moon."

I ask, "But how am I to get up to you?"
They answer, "Come to the edge of the earth."`,
    'rabindranath-tagore',
    ['joy', 'calm'],
    'Bengali',
    'A playful poem about childhood imagination.'
  ),
  // MORE RUMI POEMS
  createPoem(
    'out-beyond',
    'Out Beyond Ideas',
    `Out beyond ideas of wrongdoing and rightdoing,
there is a field.
I\'ll meet you there.

When the soul lies down in that grass,
the world is too full to talk about.
Ideas, language, even the phrase \'each other\'
doesn\'t make any sense.`,
    'rumi',
    ['love', 'hope', 'calm'],
    'Persian',
    'An invitation to transcend judgment and meet in pure being.'
  ),
  createPoem(
    'wound-light',
    'The Wound Is the Place',
    `The wound is the place where the Light enters you.

Don\'t turn away.
Keep your gaze on the bandaged place.
That\'s where the light enters you.`,
    'rumi',
    ['healing', 'hope'],
    'Persian',
    'Finding meaning and transformation through suffering.'
  ),
  createPoem(
    'be-melting-snow',
    'Be Melting Snow',
    `Be melting snow.
Wash yourself of yourself.

A white flower grows in the quietness.
Let your tongue become that flower.`,
    'rumi',
    ['calm', 'healing'],
    'Persian',
    'An invitation to surrender the ego and find peace.'
  ),
  // MORE EMILY DICKINSON
  createPoem(
    'tell-truth-slant',
    'Tell all the truth but tell it slant',
    `Tell all the truth but tell it slant—
Success in Circuit lies,
Too bright for our infirm Delight
The Truth\'s superb surprise.

As Lightning to the Children eased
With explanation kind,
The Truth must dazzle gradually
Or every man be blind.`,
    'emily-dickinson',
    ['reflection', 'hope'],
    'English',
    'A philosophy of indirect revelation.'
  ),
  createPoem(
    'soul-selects',
    'The Soul selects her own Society',
    `The Soul selects her own Society—
Then—shuts the Door—
To her divine Majority—
Present no more—

Unmoved—she notes the Chariots—pausing—
At her low Gate—
Unmoved—an Emperor be kneeling
Upon her Mat—`,
    'emily-dickinson',
    ['calm', 'reflection'],
    'English',
    'A meditation on selective intimacy and the soul\'s autonomy.'
  ),
  // MORE LANGSTON HUGHES
  createPoem(
    'harlem',
    'Harlem',
    `What happens to a dream deferred?

Does it dry up
like a raisin in the sun?
Or fester like a sore—
And then run?

Does it stink like rotten meat?
Or crust and sugar over—
like a syrupy sweet?

Maybe it just sags
like a heavy load.

Or does it explode?`,
    'langston-hughes',
    ['sad', 'reflection', 'hope'],
    'English',
    'A meditation on delayed justice and unfulfilled dreams.'
  ),
  createPoem(
    'mother-to-son',
    'Mother to Son',
    `Well, son, I\'ll tell you:
Life for me ain\'t been no crystal stair.
It\'s had tacks in it,
And splinters,
And boards torn up,
And places with no carpet on the floor—
Bare.

But all the time
I\'se been a-climbin\' on.`,
    'langston-hughes',
    ['hope', 'healing'],
    'English',
    'A mother\'s wisdom about perseverance through hardship.'
  ),
  // MORE MARY OLIVER
  createPoem(
    'summer-day',
    'The Summer Day',
    `Who made the world?
Who made the swan, and the black bear?
Who made the grasshopper?

This grasshopper, I mean—
the one who has flung herself out of the grass,
the one who is eating sugar out of my hand.

Tell me, what is it you plan to do
with your one wild and precious life?`,
    'mary-oliver',
    ['reflection', 'hope', 'joy'],
    'English',
    'A famous question challenging readers to consider their purpose.'
  ),
  createPoem(
    'uses-of-sorrow',
    'The Uses of Sorrow',
    `Someone I loved once gave me
a box full of darkness.

It took me years to understand
that this, too, was a gift.`,
    'mary-oliver',
    ['healing', 'hope'],
    'English',
    'A brief but profound meditation on finding meaning in grief.'
  ),
  // MORE HAFEZ
  createPoem(
    'wild-deer',
    'Wild Deer',
    `I am a hole in a flute
that the Christ\'s breath moves through—
listen to this music.

I am the concert from the mouth of every creature
singing with the myriad chorus.`,
    'hafez',
    ['joy', 'love', 'calm'],
    'Persian',
    'Divine love expressed through music and joy.'
  ),
  createPoem(
    'forgiveness-hafez',
    'Forgiveness',
    `What is this precious love and laughter
budding in our hearts?
It is the glorious sound
of a soul waking up!`,
    'hafez',
    ['joy', 'hope', 'healing'],
    'Persian',
    'An awakening of the soul through love.'
  ),
  // MORE NERUDA
  createPoem(
    'sonnet-xvii',
    'Sonnet XVII',
    `I don\'t love you as if you were a rose of salt, topaz,
or arrow of carnations that propagate fire:
I love you as one loves certain obscure things,
secretly, between the shadow and the soul.

I love you without knowing how, or when, or from where,
I love you directly without problems or pride.`,
    'pablo-neruda',
    ['love'],
    'Spanish',
    'One of the most beloved love sonnets.'
  ),
  // MORE RUSSIAN
  createPoem(
    'courage',
    'Courage',
    `We know what trembles on the scales
and what we have prepared for.
The bravest hour is striking now:
May courage not forsake us!`,
    'anna-akhmatova',
    ['hope', 'reflection'],
    'Russian',
    'A call for courage during dark times.'
  ),
  // AFRICAN POEMS
  createPoem(
    'song-of-sorrow',
    'Song of Sorrow',
    `Fate has treated me thus:
It has led me among the thorns of the forest,
Returning me with wounds in my body.
It drops me upon the hills
And I slide down to the marshlands.

I have no brother,
My friends are dead in their youth.`,
    'wole-soyinka',
    ['sad', 'melancholy'],
    'English',
    'A poem exploring grief and the human condition.'
  ),
  createPoem(
    'black-woman',
    'Black Woman',
    `Naked woman, black woman
Clothed with your colour which is life,
With your form which is beauty!
In your shadow I have grown up.
The gentleness of your hands
shielded my eyes.`,
    'wole-soyinka',
    ['love', 'hope'],
    'French',
    'A celebration of African womanhood and beauty.'
  ),
  createPoem(
    'ancestors-poem',
    'The Ancestors',
    `They speak through the wind,
Through the rustle of leaves,
Through the babbling brook.
Their wisdom flows eternal,
A river of memory
Connecting us to the source.`,
    'wole-soyinka',
    ['hope', 'reflection'],
    'Zulu',
    'Poetry celebrating African philosophy and ancestral wisdom.'
  ),
  // UK POEMS - Shakespeare, Keats, Wordsworth, Shelley
  createPoem(
    'sonnet-18',
    'Sonnet 18',
    `Shall I compare thee to a summer's day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer's lease hath all too short a date.

Sometime too hot the eye of heaven shines,
And often is his gold complexion dimm'd;
And every fair from fair sometime declines,
By chance or nature's changing course untrimm'd.`,
    'william-shakespeare',
    ['love', 'hope'],
    'English',
    'One of Shakespeare\'s most famous sonnets celebrating eternal beauty through poetry.'
  ),
  createPoem(
    'ode-nightingale',
    'Ode to a Nightingale',
    `My heart aches, and a drowsy numbness pains
My sense, as though of hemlock I had drunk,
Or emptied some dull opiate to the drains
One minute past, and Lethe-wards had sunk:

'Tis not through envy of thy happy lot,
But being too happy in thine happiness,—
That thou, light-winged Dryad of the trees
In some melodious plot.`,
    'john-keats',
    ['melancholy', 'calm', 'reflection'],
    'English',
    'Keats\'s meditation on mortality, art, and the transcendent power of beauty.'
  ),
  createPoem(
    'daffodils',
    'I Wandered Lonely as a Cloud',
    `I wandered lonely as a cloud
That floats on high o'er vales and hills,
When all at once I saw a crowd,
A host, of golden daffodils;

Beside the lake, beneath the trees,
Fluttering and dancing in the breeze.
Continuous as the stars that shine
And twinkle on the milky way.`,
    'william-wordsworth',
    ['joy', 'calm', 'hope'],
    'English',
    'Wordsworth\'s iconic celebration of nature and memory.'
  ),
  createPoem(
    'ozymandias',
    'Ozymandias',
    `I met a traveller from an antique land,
Who said—"Two vast and trunkless legs of stone
Stand in the desert. . . . Near them, on the sand,
Half sunk a shattered visage lies, whose frown,

And wrinkled lip, and sneer of cold command,
Tell that its sculptor well those passions read
Which yet survive, stamped on these lifeless things,
The hand that mocked them, and the heart that fed.`,
    'percy-shelley',
    ['reflection', 'melancholy'],
    'English',
    'Shelley\'s famous sonnet on the transience of power and empire.'
  ),
  // FRENCH POEMS
  createPoem(
    'invitation-voyage',
    'Invitation to the Voyage',
    `My child, my sister,
Think of the sweetness
Of going there to live together!
To love at leisure,
To love and to die
In a land that resembles you!

The misty suns
Of those hazy skies
Have for my spirit the charms.`,
    'charles-baudelaire',
    ['love', 'longing', 'calm'],
    'French',
    'Baudelaire\'s dreamlike invitation to an ideal world of beauty and harmony.'
  ),
  createPoem(
    'drunken-boat',
    'The Drunken Boat',
    `As I was going down impassive Rivers,
I no longer felt myself guided by haulers:
Screaming Redskins had taken them as targets
And nailed them naked to colored stakes.

I was heedless of all crews,
Carriers of English cotton or Flemish grain.
When with my haulers this uproar was done
The Rivers let me go where I wanted.`,
    'arthur-rimbaud',
    ['reflection', 'hope'],
    'French',
    'Rimbaud\'s visionary poem of liberation and artistic freedom.'
  ),
  createPoem(
    'autumn-song',
    'Autumn Song',
    `The long sobs
Of the violins
Of autumn
Wound my heart
With a monotonous
Languor.

All suffocating
And pale, when
The hour sounds,
I remember
Former days
And I cry.`,
    'paul-verlaine',
    ['sad', 'melancholy'],
    'French',
    'Verlaine\'s melancholic evocation of autumn and memory.'
  ),
  // GERMAN POEMS
  createPoem(
    'erlking',
    'The Erlking',
    `Who rides so late through the night and wind?
It is the father with his child;
He has the boy well in his arm,
He holds him safely, he keeps him warm.

"My son, why do you hide your face in fear?"
"Father, do you not see the Erlking?
The Erlking with crown and train?"
"My son, it is a streak of mist."`,
    'johann-goethe',
    ['sad', 'melancholy', 'reflection'],
    'German',
    'Goethe\'s haunting ballad of a supernatural encounter.'
  ),
  createPoem(
    'panther',
    'The Panther',
    `His vision, from the constantly passing bars,
has grown so weary that it cannot hold
anything else. It seems to him there are
a thousand bars; and behind the bars, no world.

As he paces in cramped circles, over and over,
the movement of his powerful soft strides
is like a ritual dance around a center
in which a mighty will stands paralyzed.`,
    'rainer-rilke',
    ['sad', 'reflection', 'melancholy'],
    'German',
    'Rilke\'s profound meditation on captivity and the caged soul.'
  ),
  createPoem(
    'lorelei',
    'The Lorelei',
    `I do not know what it means
That I am so sad;
A tale from ancient times
I cannot get out of my head.

The air is cool and twilight falls
And softly flows the Rhine;
The peak of the mountain glistens
In the fading sunshine.`,
    'heinrich-heine',
    ['melancholy', 'longing'],
    'German',
    'Heine\'s famous poem about the legendary siren of the Rhine.'
  ),
  // ITALIAN POEMS
  createPoem(
    'inferno-opening',
    'Inferno: Opening',
    `Midway upon the journey of our life
I found myself within a forest dark,
For the straightforward pathway had been lost.

Ah me! how hard a thing it is to say
What was this forest savage, rough, and stern,
Which in the very thought renews the fear.

So bitter is it, death is little more.`,
    'dante-alighieri',
    ['reflection', 'hope', 'melancholy'],
    'Italian',
    'The opening of Dante\'s Divine Comedy, beginning his journey through Hell.'
  ),
  createPoem(
    'infinito',
    'The Infinite',
    `Always dear to me was this lonely hill,
And this hedge, which from so great a part
Of the farthest horizon excludes the gaze.

But sitting and gazing, endless
Spaces beyond that, and superhuman
Silences, and profoundest quiet
I in my thoughts imagine.`,
    'giacomo-leopardi',
    ['calm', 'reflection', 'melancholy'],
    'Italian',
    'Leopardi\'s contemplation of infinity and the sublime.'
  ),
  // SPANISH POEMS
  createPoem(
    'romance-sonambulo',
    'Sleepwalking Ballad',
    `Green, how I want you green.
Green wind. Green branches.
The ship out on the sea
and the horse on the mountain.

With the shadow at her waist
she dreams on her balcony,
green flesh, green hair,
with eyes of cold silver.`,
    'federico-garcia-lorca',
    ['love', 'melancholy', 'longing'],
    'Spanish',
    'Lorca\'s haunting ballad blending Gypsy themes with surrealism.'
  ),
  createPoem(
    'traveler',
    'Traveler',
    `Traveler, there is no path,
the path is made by walking.

By walking one makes the path,
and upon looking back
one sees the path that never
will be trod again.

Traveler, there is no path,
only wakes upon the sea.`,
    'antonio-machado',
    ['hope', 'reflection'],
    'Spanish',
    'Machado\'s famous meditation on life\'s journey and individual destiny.'
  ),
  // GREEK POEMS
  createPoem(
    'ithaka',
    'Ithaka',
    `As you set out for Ithaka
hope the voyage is a long one,
full of adventure, full of discovery.
Laistrygonians and Cyclops,
angry Poseidon—don't be afraid of them:
you'll never find things like that on your way
as long as you keep your thoughts raised high.`,
    'constantine-cavafy',
    ['hope', 'reflection'],
    'Greek',
    'Cavafy\'s allegory of life\'s journey using Homer\'s Odyssey.'
  ),
  createPoem(
    'axion-esti',
    'The Axion Esti',
    `In the beginning the light And the first hour
when lips still in clay
tried out the things of the world—

Green blood and bulbs golden in the earth
And the sea, so that I could learn
What wood the wood is made of.`,
    'odysseas-elytis',
    ['hope', 'joy', 'reflection'],
    'Greek',
    'Elytis\'s Nobel Prize-winning hymn to the Greek spirit and light.'
  ),
  // ARGENTINE POEMS
  createPoem(
    'limits',
    'Limits',
    `Of all the streets that blur in to the sunset,
There must be one (which, I am not sure)
That I by now have walked for the last time
Without guessing it, the pawn of that Someone

Who fixes in advance omnipotent laws,
Sets up a secret and unwavering scale
For all the shadows, dreams, and forms
Woven into the texture of this life.`,
    'jorge-luis-borges',
    ['melancholy', 'reflection'],
    'Spanish',
    'Borges\'s meditation on mortality and the unknowable limits of existence.'
  ),
  createPoem(
    'im-going-to-sleep',
    'I\'m Going to Sleep',
    `Teeth of flowers, headdress of dew,
hands of herbs, you, gentle nurse,
prepare my earthly sheets for me
and the down of weeded moss.

I\'m going to sleep, my nurse, put me to bed.
Set a lamp at the headboard;
a constellation, whichever one you like;
all are good: lower it a little.`,
    'alfonsina-storni',
    ['calm', 'sad', 'melancholy'],
    'Spanish',
    'Storni\'s poignant farewell poem written shortly before her death.'
  ),
  // MEXICAN POEMS
  createPoem(
    'sunstone',
    'Sunstone',
    `A willow of crystal, a poplar of water,
a tall fountain the wind arches over,
a tree deep-rooted yet dancing still,
a course of a river that turns, moves on,

doubles back, and comes full circle,
forever arriving.`,
    'octavio-paz',
    ['love', 'reflection', 'hope'],
    'Spanish',
    'Paz\'s Nobel Prize-winning circular poem on time, love, and consciousness.'
  ),
  createPoem(
    'this-afternoon',
    'This Afternoon, My Dear',
    `This afternoon, my dear, when we spoke,
I could see in your face and hear in your voice
that you were not convinced:
I\'ll convince you.

Love is born of beautiful words,
love itself does not live in them:
words are leaves, but love is the root.`,
    'sor-juana',
    ['love', 'reflection'],
    'Spanish',
    'Sor Juana\'s defense of love and the power of authentic feeling.'
  ),
  // BRAZILIAN POEMS
  createPoem(
    'middle-of-road',
    'In the Middle of the Road',
    `In the middle of the road there was a stone
there was a stone in the middle of the road
there was a stone
in the middle of the road there was a stone.

Never should I forget this event
in the life of my fatigued retinas.
Never should I forget that in the middle of the road
there was a stone.`,
    'carlos-drummond',
    ['reflection', 'melancholy'],
    'Portuguese',
    'Drummond\'s modernist poem that became an icon of Brazilian literature.'
  ),
  createPoem(
    'motif',
    'Motif',
    `I sing because the moment exists
and my life is complete.
I am neither happy nor sad:
I am a poet.

Brother of the fleeting things,
I feel no pride nor scorn.
I transform chance events
into an endless journey.`,
    'cecilia-meireles',
    ['calm', 'reflection', 'hope'],
    'Portuguese',
    'Meireles\'s definition of the poet\'s existence and purpose.'
  ),
  // EGYPTIAN POEMS
  createPoem(
    'nile-poem',
    'The Nile',
    `From where does the Nile come?
From the tears of angels,
from the prayers of the saints,
from the dreams of Pharaohs.

It flows through time,
carrying the secrets of ages,
a silver serpent
beneath the golden sun.`,
    'ahmed-shawqi',
    ['hope', 'reflection'],
    'Arabic',
    'Shawqi\'s tribute to Egypt\'s eternal river.'
  ),
  // IRAQI POEMS
  createPoem(
    'cholera',
    'Cholera',
    `It is night.
Listen to the echo of the mourner
receiving the silence with laments,
In the silence of the night.

Behind the door, the grieving stranger
recalls the dead:
the echo of its call:
wherever you listen, there is grief.`,
    'nazik-al-malaika',
    ['sad', 'melancholy'],
    'Arabic',
    'Al-Malaika\'s pioneering free verse poem mourning an epidemic.'
  ),
  // MORE AMERICAN POEMS
  createPoem(
    'song-myself',
    'Song of Myself',
    `I celebrate myself, and sing myself,
And what I assume you shall assume,
For every atom belonging to me as good belongs to you.

I loafe and invite my soul,
I lean and loafe at my ease observing a spear of summer grass.

My tongue, every atom of my blood, form'd from this soil, this air.`,
    'walt-whitman',
    ['joy', 'hope', 'reflection'],
    'English',
    'Whitman\'s democratic epic celebrating the self and all humanity.'
  ),
  createPoem(
    'road-not-taken',
    'The Road Not Taken',
    `Two roads diverged in a yellow wood,
And sorry I could not travel both
And be one traveler, long I stood
And looked down one as far as I could
To where it bent in the undergrowth;

Then took the other, as just as fair,
And having perhaps the better claim,
Because it was grassy and wanted wear.`,
    'robert-frost',
    ['reflection', 'hope'],
    'English',
    'Frost\'s meditation on choice and the paths we take in life.'
  ),
  createPoem(
    'still-i-rise-full',
    'Still I Rise',
    `You may write me down in history
With your bitter, twisted lies,
You may tread me in the very dirt
But still, like dust, I'll rise.

Does my sassiness upset you?
Why are you beset with gloom?
'Cause I walk like I've got oil wells
Pumping in my living room.`,
    'maya-angelou',
    ['hope', 'healing'],
    'English',
    'Angelou\'s defiant anthem of resilience and dignity.'
  ),
  createPoem(
    'raven',
    'The Raven',
    `Once upon a midnight dreary, while I pondered, weak and weary,
Over many a quaint and curious volume of forgotten lore—
While I nodded, nearly napping, suddenly there came a tapping,
As of some one gently rapping, rapping at my chamber door.

"'Tis some visitor," I muttered, "tapping at my chamber door—
Only this and nothing more."`,
    'edgar-allan-poe',
    ['melancholy', 'sad'],
    'English',
    'Poe\'s haunting narrative poem of loss and the supernatural.'
  ),
  // MORE RUSSIAN POEMS
  createPoem(
    'i-loved-you',
    'I Loved You',
    `I loved you; even now I may confess,
Some embers of my love their fire retain;
But do not let it cause you more distress,
I do not want to sadden you again.

Hopeless and tonguetied, yet I loved you dearly
With pangs the jealous and the timid know;
So tenderly I loved you, so sincerely,
I pray God grant another love you so.`,
    'alexander-pushkin',
    ['love', 'sad', 'hope'],
    'Russian',
    'Pushkin\'s tender farewell to a past love.'
  ),
  createPoem(
    'attempt-jealousy',
    'An Attempt at Jealousy',
    `How is your life with the other one,
simpler, isn't it? One stroke of the oar
then a long coastline, and soon
even the memory of me

will be a floating island
(in the sky, not on the waters):
spirits, spirits, you will be
sisters, and never lovers.`,
    'marina-tsvetaeva',
    ['love', 'sad', 'longing'],
    'Russian',
    'Tsvetaeva\'s passionate and defiant poem on love and jealousy.'
  ),
  // MORE CHINESE POEMS
  createPoem(
    'drinking-alone',
    'Drinking Alone Under the Moon',
    `A jug of wine among the flowers,
I drink alone, no friend near.
Raising my cup, I invite the moon;
With my shadow, we become three.

The moon does not know how to drink;
My shadow follows me in vain.
But with moon and shadow as companions,
I may enjoy the spring.`,
    'li-bai',
    ['calm', 'melancholy', 'reflection'],
    'Chinese',
    'Li Bai\'s famous poem on solitude and the companionship of nature.'
  ),
  createPoem(
    'moonlit-night',
    'Moonlit Night',
    `Tonight at Fu-chou, she watches the moon alone,
From her chamber, I think of my children far away.
I pity them, too young to remember Chang\'an,
Her cloud-like hair damp with fragrant mist,

Jade arms cold in the clear moonlight.
When shall we lean in the empty window together,
As the moonlight dries our tears?`,
    'du-fu',
    ['longing', 'sad', 'love'],
    'Chinese',
    'Du Fu\'s touching poem of separation during wartime.'
  ),
  // MORE KOREAN POEMS
  createPoem(
    'foreword',
    'Foreword',
    `Dying away to heaven,
I would have no grief.
The wind that stirs the leaves
Also torments me.

With a heart that sings the stars,
I shall love all dying things.
And I must walk the path
That is given to me.`,
    'yun-dong-ju',
    ['hope', 'reflection', 'calm'],
    'Korean',
    'Yun Dong-ju\'s poetic manifesto written under Japanese occupation.'
  ),
  // MORE TURKISH POEMS
  createPoem(
    'on-living-full',
    'On Living',
    `Living is no laughing matter:
you must live with great seriousness
like a squirrel, for example—
I mean without looking for something beyond and above living,
I mean living must be your whole occupation.

Living is no laughing matter:
you must take it seriously,
so much so and to such a degree
that, for example, your hands tied behind your back,
your back to the wall.`,
    'nazim-hikmet',
    ['hope', 'reflection'],
    'Turkish',
    'Hikmet\'s passionate affirmation of life despite adversity.'
  ),
  // MORE PALESTINIAN POEMS
  createPoem(
    'identity-card',
    'Identity Card',
    `Write down!
I am an Arab
And my identity card number is fifty thousand
I have eight children
And the ninth will come after a summer
Will you be angry?

Write down!
I am an Arab
Employed with fellow workers at a quarry.`,
    'mahmoud-darwish',
    ['hope', 'reflection', 'sad'],
    'Arabic',
    'Darwish\'s defiant assertion of Palestinian identity and dignity.'
  ),
  // MORE PAKISTANI POEMS
  createPoem(
    'speak-full',
    'Speak',
    `Speak, for your lips are free;
Speak, your tongue is still your own;
This straight body still is yours—
Speak, your life is still your own.

Look how in the blacksmith\'s forge
The flames leap high and the iron glows red;
The bars of the cage are opening,
The tongue of each padlock is sliding loose.`,
    'faiz-ahmed-faiz',
    ['hope', 'reflection'],
    'Urdu',
    'Faiz\'s call for courage and freedom of expression.'
  ),
  // MORE INDIAN POEMS
  createPoem(
    'thousand-desires-full',
    'A Thousand Desires',
    `A thousand desires, each worth dying for—
Many were satisfied, yet many remain.
I have spent so many nights crying,
Yet still my heart is not at ease.

Why do you ask how I am?
The same way as before.
And what have the years taught me?
Only that nothing has changed.`,
    'mirza-ghalib',
    ['love', 'melancholy', 'reflection'],
    'Urdu',
    'Ghalib\'s profound meditation on desire and the human condition.'
  ),
  // MORE JAPANESE HAIKU
  createPoem(
    'evening-bell',
    'Evening Bell',
    `Evening bell—
the fragrance of cherry blossoms
still lingering.`,
    'yosa-buson',
    ['calm', 'melancholy'],
    'Japanese',
    'Buson\'s evocation of transience and beauty.'
  ),
  createPoem(
    'snail-fuji',
    'O Snail',
    `O snail
Climb Mount Fuji,
But slowly, slowly!`,
    'kobayashi-issa',
    ['hope', 'calm'],
    'Japanese',
    'Issa\'s gentle encouragement to persevere at one\'s own pace.'
  ),
  // MORE PERSIAN POEMS
  createPoem(
    'children-adam',
    'Children of Adam',
    `Human beings are members of a whole,
In creation of one essence and soul.
If one member is afflicted with pain,
Other members uneasy will remain.

If you have no sympathy for human pain,
The name of human you cannot retain.`,
    'saadi',
    ['hope', 'healing', 'reflection'],
    'Persian',
    'Saadi\'s famous poem inscribed at the UN entrance, on human unity.'
  ),
  createPoem(
    'rubaiyat',
    'The Rubaiyat',
    `Awake! for Morning in the Bowl of Night
Has flung the Stone that puts the Stars to Flight:
And Lo! the Hunter of the East has caught
The Sultan\'s Turret in a Noose of Light.

Come, fill the Cup, and in the fire of Spring
The Winter garment of Repentance fling:
The Bird of Time has but a little way
To fly—and Lo! the Bird is on the Wing.`,
    'khayyam',
    ['reflection', 'hope', 'melancholy'],
    'Persian',
    'Khayyam\'s philosophical quatrains on mortality and seizing the day.'
  ),
  // MORE CHILEAN POEMS
  createPoem(
    'walking-around',
    'Walking Around',
    `It happens that I am tired of being a man.
It happens that I go into tailors\' shops and movies
withered, impervious, like a felt swan
navigating in a water of origin and ash.

The smell of barbershops makes me weep.
I want only a rest from stones or from wool,
I want only not to see establishments or gardens,
or merchandise or eyeglasses or elevators.`,
    'pablo-neruda',
    ['sad', 'melancholy', 'reflection'],
    'Spanish',
    'Neruda\'s surrealist expression of urban alienation and existential weariness.'
  ),
];

export const getTodaysPoem = (): Poem => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return poems[dayOfYear % poems.length];
};

export const getPoemsByMood = (mood: Mood): Poem[] => {
  return poems.filter(poem => poem.moods.includes(mood));
};

export const getPoemsByCountry = (countryCode: string): Poem[] => {
  return poems.filter(poem => poem.countryCode === countryCode);
};

export const getPoemsByPoet = (poetId: string): Poem[] => {
  return poems.filter(poem => poem.poetId === poetId);
};

export const getPoemById = (id: string): Poem | undefined => {
  return poems.find(poem => poem.id === id);
};
