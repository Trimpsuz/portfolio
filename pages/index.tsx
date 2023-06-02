import { createStyles, Container, Text, Card, rem, Group, SimpleGrid, Anchor, Flex } from '@mantine/core';
import type { NextPage } from 'next';
import { useViewportSize, useMouse, useScrollIntoView } from '@mantine/hooks';
import { useEffect, useRef, useState, forwardRef, Key } from 'react';
import axios from 'axios';
import { Github, Mail } from 'lucide-react';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    boxSizing: 'border-box',
    minHeight: '255vh',
    backgroundColor: theme.colors.secondary[0],
  },

  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);',
    backgroundPosition: '50% 50%',
    backgroundSize: '1.1rem 1.1rem',
    pointerEvents: 'none',
  },

  inner: {
    position: 'relative',
    paddingTop: useViewportSize().height / 3,
    paddingBottom: rem(120),

    maxHeight: rem(500),
  },

  title: {
    fontFamily: theme.headings.fontFamily,
    fontSize: rem(62),
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colors.primary,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(42),
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontFamily: theme.headings.fontFamily,
    fontSize: rem(18),
    fontWeight: 600,
    maxWidth: rem(500),
  },

  testaustime: {
    fontFamily: theme.headings.fontFamily,
    lineHeight: 1.1,
    color: theme.colors.primary,
    backgroundColor: theme.colors.secondary[1],
    maxHeight: rem(90),
    minWidth: rem(450),
    minHeight: rem(90),
    zIndex: 2,
    border: `0.0625rem solid ${theme.colors.secondary[2]}`,
    transformOrigin: '0 0',
    transition: 'min-height 0.8s, max-height 0.8s, transform 0.8s, line-height 0.8s',

    '&:hover': {
      minHeight: 'auto',
      maxHeight: rem(500),
      transform: 'scale(1.1)',
      lineHeight: 0.6,
    },
  },

  contentWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: theme.spacing.xl,
    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },

  cardsOuterContainer: {
    position: 'absolute',
    top: 0,
    height: useViewportSize().height * 1.42,
    display: 'flex',
    alignItems: 'center',
    marginTop: useViewportSize().height / 3,
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },

  cardsOuterContainer2: {
    position: 'absolute',
    top: 0,
    height: useViewportSize().height * 1.348,
    display: 'flex',
    alignItems: 'center',
    marginTop: '100vh',
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },

  verticalText: {
    writingMode: 'vertical-lr',
    transform: 'rotate(-180deg) translateY(-40%)',
    color: theme.colors.primary,
    fontFamily: theme.headings.fontFamily,
    position: 'absolute',
    alignSelf: 'flex-start',
    fontSize: rem(20),
    fontWeight: 600,
  },

  verticalText2: {
    writingMode: 'vertical-lr',
    transform: 'rotate(-180deg) translateY(-50%)',
    color: theme.colors.primary,
    fontFamily: theme.headings.fontFamily,
    position: 'absolute',
    alignSelf: 'flex-start',
    fontSize: rem(20),
    fontWeight: 600,
  },

  card: {
    fontFamily: theme.headings.fontFamily,
    fontSize: rem(14),
    backgroundColor: theme.colors.secondary[1],
    position: 'relative',
    border: `0.0625rem solid ${theme.colors.secondary[2]}`,
    minHeight: rem(185),

    '&::before': {
      background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.06),transparent 40%)`,
      position: 'absolute',
      height: '100%',
      left: '0px',
      top: '0px',
      width: '100%',
      borderRadius: 'inherit',
      content: '""',
      zIndex: 2,
      opacity: 0,
      transition: 'opacity 0.5s',
    },

    '&:hover::before': {
      opacity: 1,
    },
  },

  cardTitle: {
    color: theme.colors.primary,
    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.colors.accent,
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
      fontFamily: theme.headings.fontFamily,
    },
  },

  footer: {
    zIndex: 2,
    flexShrink: 0,
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    backdropFilter: 'saturate(180%) blur(20px)',
    padding: '10px',
    height: rem(55),
  },

  footerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '120%',
  },

  footerCenter: {
    flex: '0 1 auto',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },

  footerRight: {
    flex: '0 1 auto',
    marginLeft: 'auto',
    height: '85%',
    marginRight: rem(20),
    color: theme.colors.primary,
    fontWeight: 600,
  },
}));

function formatTime(seconds: any) {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = seconds % 60;

  let result = '';

  if (days > 0) {
    result += days === 1 ? '1 day' : `${days} days`;
  }
  if (hours > 0) {
    if (result) {
      result += ', ';
    }
    result += hours === 1 ? '1 hour' : `${hours} hours`;
  }
  if (minutes > 0) {
    if (result) {
      result += ', ';
    }
    result += minutes === 1 ? '1 minute' : `${minutes} minutes`;
  }
  if (remainingSeconds > 0) {
    if (result) {
      result += ', ';
    }
    result += remainingSeconds === 1 ? '1 second' : `${remainingSeconds} seconds`;
  }

  const lastIndex = result.lastIndexOf(', ');
  if (lastIndex !== -1) {
    result = result.substring(0, lastIndex) + ' and ' + result.substring(lastIndex + 2);
  }

  return result.trim();
}

const beautifiedNames: { [key: string]: string } = {
  '': 'Unknown',
  Log: 'Log',
  css: 'CSS',
  dockercompose: 'Docker Compose',
  html: 'HTML',
  ignore: 'Ignore',
  ini: 'INI',
  javascript: 'Javascript',
  javascriptreact: 'Javascript with React',
  json: 'JSON',
  jsonc: 'JSONC',
  markdown: 'Markdown',
  plaintext: 'Plain Text',
  powershell: 'PowerShell',
  prisma: 'Prisma',
  properties: 'Properties',
  python: 'Python',
  shellscript: 'Shell Script',
  toml: 'TOML',
  typescript: 'Typescript',
  typescriptreact: 'Typescript with React',
  xml: 'XML',
  yaml: 'YAML',
};

const FirstContainer = forwardRef<HTMLDivElement>((props, ref) => {
  const { classes, theme } = useStyles();

  let testaustimeData;
  const [jsonData, setJsonData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}`);

        const filteredData = Object.entries(response.data.last_month.languages).reduce<{ [key: string]: number }>((acc, [key, value]) => {
          const numValue = Number(value);
          if (!isNaN(numValue) && numValue !== 0) {
            acc[key] = numValue;
          }
          return acc;
        }, {});

        let updatedData: { [key: string]: number } = {};

        for (let key in filteredData) {
          if (beautifiedNames.hasOwnProperty(key)) {
            const beautifiedName = beautifiedNames[key];
            updatedData[beautifiedName] = filteredData[key];
          }
        }

        setJsonData(updatedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!jsonData) {
    return (
      <Container ref={ref} size={1150} className={classes.inner}>
        <div className={classes.contentWrapper}>
          <div>
            <h1 className={classes.title}>
              {'Hi,'}
              <br /> {'I’m '}
              <Text component="span" variant="gradient" gradient={{ from: '#7d34e7', to: '#e534af' }} inherit>
                trimpsuz
              </Text>
            </h1>

            <Text className={classes.description} color="dimmed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, quibusdam, consequatur nisi, odit commodi aliquid recusandae illum perferendis earum vel consequuntur harum aperiam
              reprehenderit vero?
            </Text>
          </div>

          <Card shadow="md" radius="md" padding="lg" className={classes.testaustime}>
            <Group position="apart" styles={(theme) => ({ marginBottom: 5, marginTop: theme.spacing.sm })}>
              <Text ff={theme.headings.fontFamily} weight={800} size={rem(30)}>
                <Text ff={theme.headings.fontFamily} component="a" href="https://testaustime.fi" inherit>
                  testaustime
                </Text>{' '}
                statistics
              </Text>
            </Group>
            <br />
          </Card>
        </div>
      </Container>
    );
  }

  testaustimeData = Object.entries(jsonData).map(([key, value]) => (
    <Text key={key} ff={theme.headings.fontFamily} weight={600} size={rem(17)} styles={(theme) => ({ color: theme.colors.secondary })}>
      {key}: {String(formatTime(value))}
    </Text>
  ));

  return (
    <Container ref={ref} size={1150} className={classes.inner}>
      <div className={classes.contentWrapper}>
        <div>
          <h1 className={classes.title}>
            {'Hi,'}
            <br /> {'I’m '}
            <Text component="span" variant="gradient" gradient={{ from: '#7d34e7', to: '#e534af' }} inherit>
              trimpsuz
            </Text>
          </h1>

          <Text className={classes.description} color="dimmed">
            A {new Date().getFullYear() - 2006} year old high school student and software developer from Finland.
          </Text>
        </div>

        <Card shadow="md" radius="md" padding="lg" className={classes.testaustime}>
          <Group position="apart" styles={(theme) => ({ marginBottom: 5, marginTop: theme.spacing.sm })}>
            <Text ff={theme.headings.fontFamily} weight={800} size={rem(30)}>
              <Text ff={theme.headings.fontFamily} component="a" href="https://testaustime.fi" inherit>
                testaustime
              </Text>{' '}
              statistics
            </Text>
          </Group>
          <br />
          {testaustimeData}
        </Card>
      </div>
    </Container>
  );
});
FirstContainer.displayName = 'FirstContainer';

const projectsData = [
  {
    title: 'testaus.link',
    description: 'Quick and easy URL shortener.',
    link: 'https://testaus.link',
  },
  {
    title: 'Portfolio',
    description: 'The website you are looking at right now, built with Next.js with Typescript and Mantine.',
    link: 'https://github.com/trimpsuz/portfolio',
  },
  {
    title: 'Habitti',
    description: 'Lets you build jailbroken version of Abitti, the Finnish matriculation exam environment.',
    link: 'https://github.com/trimpsuz/habitti',
  },
];

const SecondContainer = forwardRef<HTMLDivElement>((props, ref) => {
  const { classes, theme } = useStyles();

  const cardsRef = useRef(null);

  const handleMouseMove = (e: { clientX: number; clientY: number }) => {
    const cards = (cardsRef.current as unknown as HTMLElement)?.getElementsByClassName('mantine-Card-root');

    if (cards) {
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (card instanceof HTMLElement) {
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        }
      }
    }
  };

  useEffect(() => {
    const cardsElement = cardsRef.current as unknown as HTMLElement | null;
    if (cardsElement) {
      cardsElement.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (cardsElement) {
        cardsElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const projects = projectsData.map((feature) => (
    <Anchor underline={false} key={feature.link} href={feature.link}>
      <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
        <Text fz="lg" ff={theme.headings.fontFamily} fw={600} className={classes.cardTitle} mt="md">
          {feature.title}
        </Text>
        <Text fz="sm" ff={theme.headings.fontFamily} fw={400} c="#fdfdfd" mt="sm">
          {feature.description}
        </Text>
      </Card>
    </Anchor>
  ));

  return (
    <div className={classes.cardsOuterContainer}>
      <Text className={classes.verticalText}>Projects</Text>
      <Container ref={ref} size="lg" py="xl">
        <SimpleGrid ref={cardsRef} cols={3} spacing="xl" mt={50} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
          {projects}
        </SimpleGrid>
      </Container>
    </div>
  );
});

SecondContainer.displayName = 'SecondContainer';

const skillsData = [
  {
    title: 'React',
    description: 'A Javascript library for building user interfaces with a component-based architecture and virtual DOM.',
  },
  {
    title: 'Javascript',
    description: 'A high-level programming language used for web development on the client and server sides.',
  },
  {
    title: 'Next.js',
    description: 'A React framework for server-rendered and statically-generated web applications with built-in optimizations.',
  },
  {
    title: 'Typescript',
    description: 'A statically typed superset of Javascript that enhances tooling and code organization.',
  },
  {
    title: 'Java',
    description: 'A general-purpose programming language known for platform independence and a strong type system.',
  },
  {
    title: 'Python',
    description: 'A high-level, interpreted programming language emphasizing readability and productivity.',
  },
];

const ThirdContainer = forwardRef<HTMLDivElement>((props, ref) => {
  const { classes, theme } = useStyles();

  const cardsRef = useRef(null);

  const handleMouseMove = (e: { clientX: number; clientY: number }) => {
    const cards = (cardsRef.current as unknown as HTMLElement)?.getElementsByClassName('mantine-Card-root');

    if (cards) {
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (card instanceof HTMLElement) {
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        }
      }
    }
  };

  useEffect(() => {
    const cardsElement = cardsRef.current as unknown as HTMLElement | null;
    if (cardsElement) {
      cardsElement.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (cardsElement) {
        cardsElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const projects = skillsData.map((feature) => (
    <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
      <Text fz="lg" ff={theme.headings.fontFamily} fw={600} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" ff={theme.headings.fontFamily} fw={400} c="#fdfdfd" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <div className={classes.cardsOuterContainer2}>
      <Text className={classes.verticalText2}>Skills</Text>
      <Container ref={ref} size="lg" py="xl">
        <SimpleGrid ref={cardsRef} cols={3} spacing="xl" mt={50} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
          {projects}
        </SimpleGrid>
      </Container>
    </div>
  );
});

ThirdContainer.displayName = 'ThirdContainer';

const Home: NextPage = () => {
  const { classes, theme } = useStyles();

  const containers = [FirstContainer, SecondContainer, ThirdContainer];

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const refs = containers.map(() => useScrollIntoView<HTMLDivElement>());
  const [currentElementIndex, setCurrentElementIndex] = useState(0);

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      const newIndex = currentElementIndex + (event.deltaY < 0 ? -1 : +1);
      if (newIndex >= 0 && newIndex <= refs.length - 1) {
        setCurrentElementIndex(newIndex);
        refs[newIndex].scrollIntoView({ alignment: 'center' });
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [currentElementIndex, refs]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.background} />
      {containers.map((Container, index) => {
        return <Container key={index} ref={refs[index].targetRef} />;
      })}
      <footer className={classes.footer}>
        <div className={classes.footerContent}>
          <div className={classes.footerCenter}>
            <Anchor href="https://github.com/trimpsuz">
              <Github size={25} color={theme.colors.primary[0]} />
            </Anchor>
            <Anchor href="mailto:mail@trimpsuz.xyz">
              <Mail size={25} color={theme.colors.primary[0]} style={{ marginLeft: '25px' }} />
            </Anchor>
          </div>
          <Text className={classes.footerRight}>{`© ${new Date().getFullYear()} trimpsuz`}</Text>
        </div>
      </footer>
    </div>
  );
};

export default Home;
