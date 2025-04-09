import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Felhasználóbarát Webáruház',
    description: (
      <>
        Az Adali Clothing webáruház könnyen használható felülettel rendelkezik,
        ahol egyszerűen böngészhetsz a termékek között és vásárolhatsz.
      </>
    ),
  },
  {
    title: 'Felhasználói Termékfeltöltés',
    description: (
      <>
        Regisztrált felhasználóként saját termékeidet is feltöltheted és értékesítheted
        az Adali Clothing platformján keresztül.
      </>
    ),
  },
  {
    title: 'Kuponrendszer',
    description: (
      <>
        Élvezd a kedvezményeket kuponjainkkal! Regisztrált felhasználóként
        egyedi kuponokat kaphatsz, amelyekkel kedvezményesen vásárolhatsz.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
