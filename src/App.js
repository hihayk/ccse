import './style.css';
import { questions } from './data.js';
import React from 'react';
import { useLocalStorage } from './hooks.js';

const Option = ({ children, letter, answer }) => {
  const [correction, setCorrection] = React.useState('neutral');

  const highlight = () => {
    if (letter === answer) {
      setCorrection('correct');
    } else {
      setCorrection('incorrect');
    }
  };

  return (
    <li className={correction} onClick={() => highlight()}>
      {children}
    </li>
  );
};

const FilterButton = ({ children, isActive, ...props }) => (
  <button
    className={isActive ? 'filterButton filterButton-active' : 'filterButton'}
    {...props}
  >
    {children}
  </button>
);

const difficulties = ['easy', 'ok', 'hard'];
const difficultyFilters = ['all', 'pending', ...difficulties];

const Article = ({ question, num, difficultyFilter }) => {
  const options = Object.entries(question.options);

  const [difficulty, setDifficulty] = useLocalStorage(
    `difficulty-${num}`,
    'pending'
  );

  const getDisplay = () => {
    if (difficulty === difficultyFilter || difficultyFilter === 'all') {
      return 'block';
    }

    return 'none';
  };

  return (
    <article style={{ display: getDisplay() }}>
      <div style={{ margin: '8rem 0 1rem 0', fontSize: '1rem' }}>
        <div className="buttonsRow">
          {difficulties.map((item) => (
            <FilterButton
              isActive={item === difficulty}
              onClick={() => setDifficulty(item)}
            >
              {item}
            </FilterButton>
          ))}
        </div>
      </div>

      <h2 dangerouslySetInnerHTML={{ __html: question.title }} />

      {options.map(([letter, value], index) => {
        return (
          <Option key={index} answer={question.answer} letter={letter}>
            <span className="letter">{letter})</span>{' '}
            <span dangerouslySetInnerHTML={{ __html: value }} />
          </Option>
        );
      })}
    </article>
  );
};

export default function App() {
  const [difficultyFilter, setDifficultyFilter] = useLocalStorage(
    `difficultyFilter`,
    'pending'
  );

  return (
    <div>
      <h1>CCSE 2022</h1>

      <div className="buttonsRow">
        {difficultyFilters.map((item, index) => (
          <FilterButton
            isActive={item === difficultyFilter}
            onClick={() => setDifficultyFilter(item)}
            key={index}
          >
            {item}
          </FilterButton>
        ))}
      </div>

      {questions.map((question, index) => {
        return (
          <Article
            difficultyFilter={difficultyFilter}
            num={index}
            key={index}
            question={question}
          />
        );
      })}
    </div>
  );
}
