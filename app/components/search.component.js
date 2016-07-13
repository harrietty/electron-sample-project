import React from 'react';
import Autocomplete from 'react-autocomplete';

class Search extends React.Component{
  handleRenderItem (item, isHighlighted) {
    const listStyles = {
      item: {
        padding: '2px 6px',
        cursor: 'default'
      },
      highlightedItem: {
        color: 'white',
        background: '#f38b72',
        padding: '2px 6px',
        cursor: 'default'
      }
    };
    return (
      <div style={isHighlighted ? listStyles.highlightedItem : listStyles.item}
        key={item.id}
        id={item.id}>
        {item.title}
      </div>
    );
  }
  render () {
    return (
      <div className='search'>
      <h2>HELLO</h2>
        <Autocomplete
          ref='autocomplete'
          inputProps={{title: 'title'}}
          value={this.props.autoCompleteValue}
          items={this.props.tracks}
          getItemValue={(item) => item.title}
          onSelect={this.props.handleSelect}
          onChange={this.props.handleChange}
          renderItem={this.handleRenderItem.bind(this)} />
      </div>
    );
  }
}

export default Search;
