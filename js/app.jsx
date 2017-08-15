window.ee = new EventEmitter();

var my_news = [
  {
    author: 'Саша Печкин',
    text: 'В четчерг, четвертого числа...',
    bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
  },
  {
    author: 'Просто Вася',
    text: 'Считаю, что $ должен стоить 35 рублей!',
    bigText: 'А евро 42!'
  },
  {
    author: 'Гость',
    text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
    bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
  }
];

/* =============новости============== */
var News = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {
      news: this.props.data
    }
  },

  componentDidMount() {
    var self = this;
    window.ee.addListener('News.add', function(item) {
      console.log(self.state.news);
      var nextNews = item.concat(self.state.news);
      self.setState({news: nextNews});
    });
  },

  render() {
    var data = this.state.news;
    var newsTemplate;
    //console.log(this.state.news);
    if (data.length) {
      newsTemplate = data.map(function(item, index) {
        return (
          <div key={index}>
            <Article data={item} />
          </div>
        )
      })
    } else {
      newsTemplate = <p>К сожалению новостей нет</p>
    }
   

    return (
      <div className="news">
        {newsTemplate}
        <strong className={'news__count ' +(data.length > 0 ? "": "none")}>
           Всего новостей: {data.length} 
        </strong>
      </div>
    );
  }
});

/* ===========новость================ */
var Article = React.createClass({
  propTypes: {
    data: React.PropTypes.shape({
      author: React.PropTypes.string.isRequired,
      text: React.PropTypes.string.isRequired,
      bigText: React.PropTypes.string.isRequired,
    })
  },

  getInitialState() {
    return {
      visible: false
    }
  },

  toggleVisible(e) {
    e.preventDefault();
    this.setState({visible: true})
  },

  render() {
    var author = this.props.data.author,
    text = this.props.data.text,
    bigText = this.props.data.bigText,
    visible = this.state.visible;

    return (
      <div className="article">
        <p className="news__author">{author}:</p> 
        <p className="news__text">{text}</p>
        <a  href="#" 
            className={"news__readmore" + (visible ? " none" : '')} 
            onClick={this.toggleVisible}>Подробнее</a>
        <p className={'news__big-text' + (visible ? '' : ' none')}>{bigText}</p>
      </div>   
    )
    
  }
});

/* =============Add ================ */
var Add = React.createClass({

  getInitialState() {
    return {
      agreeNotChecked: true,
      authorIsEmpty: true,
      textIsEmpty: true
    }
  },

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.author).focus();
  },

  createNew(e) {
    e.preventDefault();
    var author = ReactDOM.findDOMNode(this.refs.author);
    var text = ReactDOM.findDOMNode(this.refs.text);
    
    var item = [{
      author: author.value,
      text: text.value,
      bigText: '...'
    }];

    window.ee.emit('News.add', item);

    author.value = "";
    text.value = ""
    this.setState({
      authorIsEmpty: true,
      textIsEmpty: true,
    })

  },

  onFieldChange(fieldName, e ) {

     if (e.target.value.trim().length) {
      this.setState({[''+fieldName] : false});
    } else {
      this.setState({[''+fieldName] : true});
    } 

  }, 

  onCheckRuleClick(e) {
    this.setState({agreeNotChecked: !this.state.agreeNotChecked}); //устанавливаем значение в state
  },

  render() {
    var agreeNotChecked = this.state.agreeNotChecked;
    var authorIsEmpty = this.state.authorIsEmpty;
    var textIsEmpty = this.state.textIsEmpty;

    return (
      <form className='add cf'>
        <input
          type='text'
          className='add__author'
          onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
          placeholder='Ваше имя'
          ref='author'
        />
        <textarea
          className='add__text'
          onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
          placeholder='Текст новости'
          ref='text'
        ></textarea>
        <label className='add__checkrule'>
          <input type='checkbox' ref='checkrule' onChange={this.onCheckRuleClick} />Я согласен с правилами
        </label>
        <button
          className='add__btn'
          onClick={this.createNew}
          ref='alert_button'
          disabled={agreeNotChecked || authorIsEmpty || textIsEmpty}>
          Показать alert
        </button>
      </form>
    )
  }
});

/* ==============App================= */
var App = React.createClass({
  
  render() {
    return (
      <div className="app">
        <Add/>
        <h3>Новости</h3>
        <News data={my_news} />
     </div> 
    )
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);