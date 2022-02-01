import React from 'react'
import './App.css';

class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      items: [],
      activeItem:{
        id: null,
        title:'',
        completed:false,
      },
      editing:false,
    }
    this.fetchTems = this.fetchTems.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getCookie = this.getCookie.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.unStrike = this.unStrike.bind(this)
  }

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

  componentDidMount(){
    this.fetchTems()
  }

  fetchTems(){
    fetch('http://127.0.0.1:8000/api/list-api/')
    .then(response => response.json())
    .then(data => 
      this.setState({items:data}),
    )
  }
  handleChange(e){
    let name = e.target.name
    let value = e.target.value
    console.log(name);
    console.log(value);
    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value,
      }
    })
  }
  handleSubmit(e){
    e.preventDefault()
    console.log({'item': this.state.activeItem});
    const csrftoken = this.getCookie('csrftoken');

    let url = 'http://127.0.0.1:8000/api/create-task/'

    if(this.state.editing == true){
      url = `http://127.0.0.1:8000/api/update-task/${ this.state.activeItem.id }/`
      this.setState({
        editing:false
      })
    }

    fetch(url,{
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken':csrftoken,
      },
      body:JSON.stringify(this.state.activeItem)
    }).then((response)=>{
      this.fetchTems()
      this.setState({
        activeItem:{
          id:null,
          title: '',
          completed:false,
        }
      })
    }).catch(function(err){
      console.log('Error', err);
    })
  }
  startEdit(task){
    this.setState({
      activeItem:task,
      editing:true,
    })
  }

  deleteItem(item){
    const csrftoken = this.getCookie('csrftoken');
    const url = `http://127.0.0.1:8000/api/delete-task/${item.id}/`
    fetch(url,{
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken':csrftoken,
      },
    }).then((res)=>{
      this.fetchTems()
    })

  }

  unStrike(item){
    item.completed = !item.completed
    let url = `http://127.0.0.1:8000/api/partially-task/${item.id}/`
    const csrftoken = this.getCookie('csrftoken');
    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken':csrftoken,
      },
      body: JSON.stringify({'completed': item.completed})
    }).then(()=>{
      this.fetchTems()
    })
    console.log('completed:', item.completed);
  }


  render(){
    const { items } = this.state;
    let self = this
    // if(!completed)return (<div className='card'><div className='card-body'>Your Card Emplty</div></div>);
    return (
      <div className='container py-5'>
        <div id='task-container' className='rounded-3'>

          <div id="form-wrapper" className='rounded-3'>
            <form onSubmit={this.handleSubmit} id='form'>
              <div style={{flex: 6}}>
                <input onChange={this.handleChange} className='form-control' value={this.state.activeItem.title} id='title' />
              </div>
              <div style={{flex:1}}>
                <input id='submit' className='btn btn-primary mt-2 rounded' type='Submit' name='Add' />
              </div>
            </form>
          </div>

          <div id="list-wrapper" className='py-2 px-2'>
            {
              items.map(function(item, index){
                return(
                  <div key={index} className='task-wrapper flex-wrapper'>
                    <div onClick={()=> self.unStrike(item)} style={{flex:7}}>
                      {item.completed == false ?(
                        <span>{item.title}</span>
                      ):(
                        <strike>{item.title}</strike>
                      )}
                    </div>
                    <div style={{flex:1}}>
                      <button onClick={() => self.startEdit(item)} className='btn btn-primary'>edit</button>
                    </div>
                    <div style={{flex:1}}>
                    <button onClick={() => self.deleteItem(item)} className='btn btn-success'>-></button>
                    </div>
                  </div>
                )
              })
            }
          </div>

        </div>
      </div>
      )
  }
}

export default App;
