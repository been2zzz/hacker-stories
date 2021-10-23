import React from 'react';
import { sortBy } from 'lodash';

import styled from 'styled-components';
import { ReactComponent as Check } from './check.svg';
const StyledItem = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;

const StyledColumn = styled.span`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  a {
    color: inherit;
  }
  width: ${props => props.width};
`;

const StyledButton = styled.button`
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  cursor: pointer;
  transition: all 0.1s ease-in;
  &:hover {
    background: #171212;
    color: #ffffff;
  }
  &:hover > svg > g {
    fill: #ffffff;
    stroke: #ffffff;
  }
`;
const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`;

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENT: list => sortBy(list, 'num_comments').reverse(),
    POINT: list => sortBy(list, 'points').reverse(),
};

const List = React.memo(({ list, onRemoveItem }) => {
    const [sort, setSort] = React.useState({
        sortKey: 'NONE',
        isSorted: false,
        isReverse: false,
    });

    const handleSort = sortKey => {
        // 인자로 들어온 sortKey가 역방향 확인 로직
        const isReverse = sort.sortKey === sortKey && !sort.isReverse;
        setSort({ sortKey, isReverse }); // 단축 객체 초기자 표기법
    };
    
    const sortFunction = SORTS[sort.sortKey];
    const sortedList = sort.isReverse
        ? sortFunction(list).reverse()
        : sortFunction(list);
    return (
    <div>
        <div style={{ display: 'flex' }}>
        <span style={{ width: '40%' }}>
          <StyledButtonSmall type="button" onClick={() => handleSort('TITLE')}>
            Title
            <span>
                {'TITLE' === sort.sortKey ? (sort.isReverse ? " 👇" : " 👆") : ""}
            </span>
          </StyledButtonSmall>
        </span>
        <span style={{ width: '30%' }}>
          <StyledButtonSmall type="button" onClick={() => handleSort('AUTHOR')}>
            Author
            <span>
                {'AUTHOR' === sort.sortKey ? (sort.isReverse ? " 👇" : " 👆") : ""}
            </span>
          </StyledButtonSmall>
        </span>
        <span style={{ width: '10%' }}>
          <StyledButtonSmall type="button" onClick={() => handleSort('COMMENT')}>
            Comments
            <span>
                {'COMMENT' === sort.sortKey ? (sort.isReverse ? " 👇" : " 👆") : ""}
            </span>
          </StyledButtonSmall>
        </span>
        <span style={{ width: '10%' }}>
          <StyledButtonSmall type="button" onClick={() => handleSort('POINT')}>
            Points
            <span>
                {'POINT' === sort.sortKey ? (sort.isReverse ? " 👇" : " 👆") : ""}
            </span>
          </StyledButtonSmall>
        </span>
        <span style={{ width: '10%' }}>Dismiss</span>
      </div>
        {sortedList.map(item => (
        <Item
            key={item.objectID} 
            item={item}
            onRemoveItem={onRemoveItem}
        />
        ))}
    </div>
)});

const Item = React.memo(
  ({ item, onRemoveItem }) => console.log('item')||(
  <StyledItem>
    <StyledColumn width="40%">
      <a href={item.url}>{item.title}</a>
    </StyledColumn>
    <StyledColumn width="30%">{item.author}</StyledColumn>
    <StyledColumn width="10%">{item.num_comments}</StyledColumn>
    <StyledColumn width="10%">{item.points}</StyledColumn>
    <StyledColumn width="10%">
      <StyledButtonSmall
        type="button"
        onClick={() => onRemoveItem(item)}
      >
        <Check height="18px" width="18px" />
      </StyledButtonSmall>
    </StyledColumn>
  </StyledItem>
));

export default List;