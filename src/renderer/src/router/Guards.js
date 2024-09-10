import { AuthStore } from "../stores/Authentication";
import { useHostStore } from "../stores/Connection";
import { useModeStore } from "../stores/Mode";
import { useSetup } from "../stores/Setting/setup";


export const navGuard = async (to, from, next) => {
    const auth = AuthStore();
    const setup = useSetup()
    const connection = useHostStore();
    const mode = useModeStore();
    const authKey = await auth.isAuthenticated();
    const isSetupDone = await setup.getSystemSetting()

    if (mode.checkMode()) {
        if (await connection.isConnected()) {
            // Is Authenticated, allow
            if (authKey) {
                if (isSetupDone) {
                    next();
                    return
                }
                next({ name: 'setup' });
                return
            }
            // Is connected, allow navigation
            next({ name: 'login' });
            return
        } else {
            // Not connected, redirect to home
            next({ name: 'Home' });
            return
        }
    } else {
        // No mode selected, redirect to home
        next({ name: 'Home' });
        return
    }
};
