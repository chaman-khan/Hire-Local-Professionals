import NetInfo from "@react-native-community/netinfo";

export function isConnected() {
    return new Promise((resolve, reject) => {
        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);

            if (state.isConnected) {
                resolve();
            }
            else {
                reject();
            }
        });
    })
}