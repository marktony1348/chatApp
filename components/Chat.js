// phase 2
import React from "react";
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { 
  Button,
  Text,
  View,
  Platform, 
  KeyboardAvoidingView,
} from 'react-native';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
  }
  
  componentDidMount() {
    this.setState({
        //setting state for chat messages and for users on the app
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
        },
      ]
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  // adds background colors for the chat text to the different chat users
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: 'blue'
          }
        }}
      />
    )
  }

  render() {
    //entered name state from Start screen gets displayed in status bar at the top of the app
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // takes the definition of input parameters for the background color defined in the start.js component
    const { bgColor } = this.props.route.params;

    return (
       
      <View style={{ flex: 1, }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />  
        {/* This prevent the chat screen being undulated by the keyboard due to the small screen of some older android devices */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
        }
        </View>
    );
  }
}























// phase 1
// import React from 'react';
// import { View, Text, Button } from 'react-native';
// import { GiftedChat } from 'react-native-gifted-chat'

// export default class Chat extends React.Component {
//     render() {
//         let { name } = this.props.route.params;
//         this.props.navigation.setOptions({ title: name });

//         const { bgColor } = this.props.route.params;

//         return (
//             <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor}}>
//                 <Text>Hello Chat!</Text>
//                 <Button
//                 title="Go to chats"
//                 onPress={() => this.props.navigation.navigate('Start')}
//         />
//             </View>
//         )
//     }
// }