import React from 'react';
import { View, Text, Button } from 'react-native';

export default class Chat extends React.Component {
    render() {
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });

        const { bgColor } = this.props.route.params;

        return (
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor}}>
                <Text>Hello Chat!</Text>
                <Button
                title="Go to Start"
                onPress={() => this.props.navigation.navigate('Start')}
        />
            </View>
        )
    }
}