import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/header';

const news = () => {
    return (
        <SafeAreaView>
            <Header />
            <SafeAreaView>
                <View>
                    <Text>news</Text>
                </View>
            </SafeAreaView>

        </SafeAreaView>

    )
}

export default news

const styles = StyleSheet.create({})


