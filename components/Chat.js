import React from 'react';

// Imports GiftedChat 
import { 
    Bubble, 
    GiftedChat, 
    SystemMessage, 
    Day } from 'react-native-gifted-chat';
import { View, Platform, KeyboardAvoidingView } from 'react-native';

import * as firebase from "firebase";
import "firebase/firestore";

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: '',
                name: '',
                avatar: '',
            }
        };

        // SDK from Firestore
        const firebaseConfig = {
          apiKey: "AIzaSyDlszzbZzyEleOXFrG_FDHZDtfEzJsusHQ",
          authDomain: "chatapp-9281a.firebaseapp.com",
          projectId: "chatapp-9281a",
          storageBucket: "chatapp-9281a.appspot.com",
          messagingSenderId: "303883104975",
          appId: "1:303883104975:web:26791db3767f7d8879bdba",
          measurementId: "G-M1RHG4ZLR6"
        };

        // initializes the Firestore app
        if (!firebase.apps.length){
            firebase.initializeApp(firebaseConfig);
        }

        // references the collection to query its documents
        this.referenceChatMessages = firebase.firestore().collection('messages');

        this.refMsgsUser = null;
    }

    /* retrieves the current data in "messages" collection and 
    stores it in state "messages" to render it in view */
    onCollectionUpdate = QuerySnapshot => {
        const messages = [];
        // go through each document
        QuerySnapshot.forEach(doc => {
            // gets the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: data.user
            });
        });
        this.setState({
            messages,
        });
    };

    // creates the initial welcome message and the system message when component did mount
    componentDidMount() {

        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });
        
        this.referenceChatMessages = firebase.firestore().collection('messages');

        this.authUnsubscribe = firebase
            .auth()
            .onAuthStateChanged(async user => {
            if (!user) {
                return await firebase.auth().signInAnonymously();
            }
            this.setState({
                uid: user.uid,
                messages: [],
                user: {
                    _id: user.uid,
                    name: name,
                    avatar: 'https://placeimg.com/140/140/any',
                },
            });
            this.refMsgsUser = firebase
                .firestore()
                .collection('messages')
                .where('uid', '==', this.state.uid);

            this.unsubscribe = this.referenceChatMessages
                .orderBy('createdAt', 'desc')
                .onSnapshot(this.onCollectionUpdate);
        });
    } 

    componentWillUnmount() {
        // stop listening for changes
        this.unsubscribe();
        // stop listening to authentication
        this.authUnsubscribe();
    }

    addMessages() {
        const message = this.state.messages[0];
        // adds new message to the collection
        this.referenceChatMessages.add({
            uid: this.state.uid,
            _id: message._id,
            text: message.text || '',
            createdAt: message.createdAt,
            user: this.state.user,
        });
    }

    // appends the new message a user just sent to the state messages so it can be displayed in chat
    onSend(messages = []) {
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.addMessages();
        });
    }

    // changes the default color of the chat text bubble on the right
    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000'
                    },
                    left: {
                        backgroundColor: '#white'
                    }
                }}
            />
        );
    }

    renderSystemMessage(props) {
        return (
            <SystemMessage
                {...props} textStyle={{ color: '#fff' }} />
        );
    }

    renderDay(props) {
        return (
            <Day
                {...props}
                    textStyle={{
                        color: '#fff',
                        backgroundColor: 'gray',
                        borderRadius: 15,
                        padding: 10,
                    }}
            />
        )
    }

    render() {
        const { bgColor } = this.props.route.params;

        return (
            <View style={{flex: 1, backgroundColor: bgColor}}>
            <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            renderSystemMessage={this.renderSystemMessage}
            renderDay={this.renderDay}
            messages={this.state.messages}
            onSend={(messages) => this.onSend(messages)}
            user={{ 
                _id: this.state.user._id,
                name: this.state.name,
                avatar: this.state.user.avatar 
            }}
            />
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View>
        )
    }
}



// // phase 3
// import React from 'react';

// // Imports GiftedChat 
// import { 
//     Bubble, 
//     GiftedChat, 
//     SystemMessage, 
//     Day } from 'react-native-gifted-chat';
// import { View, Platform, KeyboardAvoidingView } from 'react-native';

// import * as firebase from "firebase";
// import "firebase/firestore";

// export default class Chat extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             messages: [],
//             uid: 0,
//             user: {
//                 _id: '',
//                 name: '',
//                 avatar: '',
//             }
//         };

//         // SDK from Firestore
//         const firebaseConfig = {
//           apiKey: "AIzaSyDlszzbZzyEleOXFrG_FDHZDtfEzJsusHQ",
//           authDomain: "chatapp-9281a.firebaseapp.com",
//           projectId: "chatapp-9281a",
//           storageBucket: "chatapp-9281a.appspot.com",
//           messagingSenderId: "303883104975",
//           appId: "1:303883104975:web:26791db3767f7d8879bdba",
//           measurementId: "G-M1RHG4ZLR6" 
//         };

//         // initializes the Firestore app
//         if (!firebase.apps.length){
//             firebase.initializeApp(firebaseConfig);
//         }

//         // references the collection to query its documents
//         this.referenceChatMessages = firebase.firestore().collection('messages');

//         this.refMsgsUser = null;
//     }

//     /* retrieves the current data in "messages" collection and 
//     stores it in state "messages" to render it in view */
//     onCollectionUpdate = QuerySnapshot => {
//         const messages = [];
//         // go through each document
//         QuerySnapshot.forEach(doc => {
//             // gets the QueryDocumentSnapshot's data
//             let data = doc.data();
//             messages.push({
//                 _id: data._id,
//                 text: data.text,
//                 createdAt: data.createdAt.toDate(),
//                 user: data.user
//             });
//         });
//         this.setState({
//             messages,
//         });
//     };

//     // creates the initial welcome message and the system message when component did mount
//     componentDidMount() {

//         let { name } = this.props.route.params;
//         this.props.navigation.setOptions({ title: name });
        
//         this.referenceChatMessages = firebase.firestore().collection('messages');

//         this.authUnsubscribe = firebase
//             .auth()
//             .onAuthStateChanged(async user => {
//             if (!user) {
//                 return await firebase.auth().signInAnonymously();
//             }
//             this.setState({
//                 uid: user.uid,
//                 messages: [],
//                 user: {
//                     _id: user.uid,
//                     name: name,
//                     avatar: 'https://placeimg.com/140/140/any',
//                 },
//             });
//             this.refMsgsUser = firebase
//                 .firestore()
//                 .collection('messages')
//                 .where('uid', '==', this.state.uid);

//             this.unsubscribe = this.referenceChatMessages
//                 .orderBy('createdAt', 'desc')
//                 .onSnapshot(this.onCollectionUpdate);
//         });
//     } 

//     componentWillUnmount() {
//         // stop listening for changes
//         this.unsubscribe();
//         // stop listening to authentication
//         this.authUnsubscribe();
//     }

//     addMessages() {
//         const message = this.state.messages[0];
//         // adds new message to the collection
//         this.referenceChatMessages.add({
//             uid: this.state.uid,
//             _id: message._id,
//             text: message.text || '',
//             createdAt: message.createdAt,
//             user: this.state.user,
//         });
//     }

//     // appends the new message a user just sent to the state messages so it can be displayed in chat
//     onSend(messages = []) {
//         this.setState((previousState) => ({
//             messages: GiftedChat.append(previousState.messages, messages),
//         }), () => {
//             this.addMessages();
//         });
//     }

//     // changes the default color of the chat text bubble on the right
//     renderBubble(props) {
//         return (
//             <Bubble
//                 {...props}
//                 wrapperStyle={{
//                     right: {
//                         backgroundColor: '#000'
//                     },
//                     left: {
//                         backgroundColor: '#white'
//                     }
//                 }}
//             />
//         );
//     }

//     renderSystemMessage(props) {
//         return (
//             <SystemMessage
//                 {...props} textStyle={{ color: '#fff' }} />
//         );
//     }

//     renderDay(props) {
//         return (
//             <Day
//                 {...props}
//                     textStyle={{
//                         color: '#fff',
//                         backgroundColor: 'gray',
//                         borderRadius: 15,
//                         padding: 10,
//                     }}
//             />
//         )
//     }

//     render() {
//         const { bgColor } = this.props.route.params;

//         return (
//             <View style={{flex: 1, backgroundColor: bgColor}}>
//             <GiftedChat
//             renderBubble={this.renderBubble.bind(this)}
//             renderSystemMessage={this.renderSystemMessage}
//             renderDay={this.renderDay}
//             messages={this.state.messages}
//             onSend={(messages) => this.onSend(messages)}
//             user={{ 
//                 _id: this.state.user._id,
//                 name: this.state.name,
//                 avatar: this.state.user.avatar 
//             }}
//             />
//             { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
//             </View>
//         )
//     }
// }

// // phase 2
// import React from "react";
// import { GiftedChat, Bubble } from 'react-native-gifted-chat';
// import { 
//   Button,
//   Text,
//   View,
//   Platform, 
//   KeyboardAvoidingView,
// } from 'react-native';

// export default class Chat extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       messages: [],
//     }
//   }
  
//   componentDidMount() {
//     this.setState({
//         //setting state for chat messages and for users on the app
//       messages: [
//         {
//           _id: 1,
//           text: 'Hello developer',
//           createdAt: new Date(),
//           user: {
//             _id: 2,
//             name: 'React Native',
//             avatar: 'https://placeimg.com/140/140/any',
//           },
//         },
//         {
//           _id: 2,
//           text: 'This is a system message',
//           createdAt: new Date(),
//           system: true,
//         },
//       ]
//     })
//   }

//   onSend(messages = []) {
//     this.setState(previousState => ({
//       messages: GiftedChat.append(previousState.messages, messages),
//     }));
//   }

//   // adds background colors for the chat text to the different chat users
//   renderBubble(props) {
//     return (
//       <Bubble
//         {...props}
//         wrapperStyle={{
//           right: {
//             backgroundColor: 'blue'
//           }
//         }}
//       />
//     )
//   }

//   render() {
//     //entered name state from Start screen gets displayed in status bar at the top of the app
//     let name = this.props.route.params.name;
//     this.props.navigation.setOptions({ title: name });

//     // takes the definition of input parameters for the background color defined in the start.js component
//     const { bgColor } = this.props.route.params;

//     return (
       
//       <View style={{ flex: 1, }}>
//         <GiftedChat
//           renderBubble={this.renderBubble.bind(this)}
//           messages={this.state.messages}
//           onSend={messages => this.onSend(messages)}
//           user={{
//             _id: 1,
//           }}
//         />  
//         {/* This prevent the chat screen being undulated by the keyboard due to the small screen of some older android devices */}
//         { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
//         }
//         </View>
//     );
//   }
// }























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