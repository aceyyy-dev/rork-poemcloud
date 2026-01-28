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
    'langston-hughes',
    ['hope', 'healing'],
    'English',
    'A powerful anthem of resilience and dignity in the face of oppression.'
  ),
  // CHINESE POEMS
  createPoem(
    'quiet-night-thought',
    'Quiet Night Thought',
    `Before my bed, the moon is shining bright,
I think that it is frost upon the ground.
I raise my head and look at the bright moon,
I lower my head and think of home.`,
    'rumi',
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
    'rumi',
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
    'rumi',
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
    'rumi',
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
    'rumi',
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
    'rumi',
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
    'khalil-gibran',
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
    'hafez',
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
    'hafez',
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
