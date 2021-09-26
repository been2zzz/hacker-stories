import React from 'react';

const title = 'React';
const welcome = {
  greeting: 'Hey',
  title: 'React',
};

function getTitle(){
  return title;
}
const App = () => {
  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];
  const [searchTerm, setSearchTerm] = React.useState('');
  // A
  const handleSearch = event =>{
    // C 상태 변환 함수
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(function(story){
    // title 중 filter된 story만
    return story.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });
  return (
    <div>
      <h1>Hello {title}</h1>
      {/* 객체 */}
      <h1> 
        {welcome.greeting} {welcome.title}
      </h1>
      {/* 함수 사용 */}
      <h1>Hello {getTitle('React')}</h1>
      <Search onSearch={handleSearch} search={searchTerm}/>
      <hr/>
      <List list={searchedStories}/>
    </div>
    );
  };

  const List = props => (
    <ul>
    {props.list.map((item) => (
      <li key={item.objectID}>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
      </li>
    ))}
  </ul>
);

const Search = props => (
  // 첫번째 : 현재 상태, 두번째: 이 상태를 업데이트하는 함수(상태 업데이트 함수)
  // 배열 구조 분해
    <div> 
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={props.onSearch} value={props.search}/>
      <p>Search for: <strong>{props.search}</strong></p>
    </div>
);

export default App;