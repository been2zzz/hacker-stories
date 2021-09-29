import React from 'react';

const title = 'React';
const welcome = {
  greeting: 'Hey',
  title: 'React',
};

// 리액트 커스텀 훅!!!!
const useSemiPersistentState = (key, initialState) =>{
  const [value, setValue] = React.useState(
    // localStorage.getItem('search') : 저장된 값이 존재하면 초기 상태 설정 사용
    // 'React' : 기본값
    localStorage.getItem(key) || initialState
    );
    
    // 첫번째 인수: 사이드 이펙트가 일어나는 함수 => 브라우저 로컬 저장소에 searchTerm 입력
    // 두번째 인수: 변수의 종속성 '배열'
    React.useEffect(() => {
      localStorage.setItem(key, value);
    }, [value, key]);

    // React.useState에 쓰일 value, setValue 반환
    return [value, setValue];
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

  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search' ,
    'React'
  );
  // A
  const handleSearch = event =>{
    // C 상태 변환 함수
    setSearchTerm(event.target.value);
    localStorage.setItem('search', event.target.value);
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

  const List = ({ list }) => 
    list.map(item => <Item key={item.objectID} item={item}/>);

  const Item = ({item}) => (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
    </div>
  );

const Search = ({ search, onSearch }) => (
  // 첫번째 : 현재 상태, 두번째: 이 상태를 업데이트하는 함수(상태 업데이트 함수)
  // 배열 구조 분해
    <div> 
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={onSearch} value={search}/>
      <p>Search for: <strong>{search}</strong></p>
    </div>
);

export default App;