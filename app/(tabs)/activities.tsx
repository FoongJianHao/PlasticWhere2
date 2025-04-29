import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Index from './index';
import Header from '@/components/header';

const now = new Date();
const month = now.toLocaleString("en-US", { month: "long" }); // "April"
const currentYear = now.getFullYear();
const previousYear = currentYear - 1;

export default function Activities() {
    return (
        <SafeAreaView>
            <Header/>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={{
                                color: 'white',
                                fontSize: 30,
                                // paddingLeft: 30,
                                paddingVertical: 100,
                                marginLeft: 30,
                                marginBottom: 0,
                                fontWeight: 'semibold',
                            }}
                            >
                                Activities & Impacts
                            </Text>
                        </View>

                        {/* Main Content Section */}
                        <View style={styles.mainContent}>
                            <Text
                                style={{
                                    marginTop: 30,
                                    color: "white",
                                    alignSelf: "flex-end",
                                    paddingRight: 150,
                                    fontSize: 20,
                                    paddingVertical: 10,
                                }}
                            >
                                Total Global Litter Content:
                            </Text>
                            <Text
                                style={{
                                    color: "white",
                                    alignSelf: "flex-end",
                                    paddingRight: 150,
                                    fontSize: 20,
                                }}
                            >
                                Pick Up:
                            </Text>
                            <Text
                                style={{
                                    color: "white",
                                    alignSelf: "center",
                                    fontSize: 22,
                                    marginTop: 50,
                                }}
                            >
                                Overall Pickup for {month} {previousYear} - {currentYear}:
                            </Text>
                            <Text
                                style={{
                                    color: "white",
                                    alignSelf: "center",
                                    fontSize: 50,
                                    marginTop: 10,
                                    fontWeight: "bold",
                                }}
                            >
                                945
                            </Text>
                        </View>

                        {/* Footer Section */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Footer Section</Text>
                        </View>
                    </View>
                </SafeAreaView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'black',
    },
    container: {
        flex: 1,
    },
    header: {
        flex: 1, // Takes 1/4 of the space
        backgroundColor: '#333',
        justifyContent: 'center',
    },
    mainContent: {
        flex: 4, // Takes 2/4 of the space
        backgroundColor: '#555',
    },
    footer: {
        flex: 1, // Takes 1/4 of the space
        backgroundColor: '#00001',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 30,
        paddingLeft: 50,
        fontWeight: 'semibold',
    },
    contentText: {
        color: 'white',
        fontSize: 16,
    },
    footerText: {
        color: 'white',
        fontSize: 20,
    },
});