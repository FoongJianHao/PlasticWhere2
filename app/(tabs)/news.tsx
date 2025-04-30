import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/header';

const news = () => {
    return (
        <View>
            <Header />
            <Text>news</Text>
        </View>
    )
}

export default news

const styles = StyleSheet.create({})


