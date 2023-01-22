import React from "react";
import TabNavigator from "./TabNavigator";
import Onboarding from "../registration/Onboarding";

export default function OnboardNavigator() {
    const onboarded = undefined;
    //const { onboarded } = onboard();

    return onboarded ? <TabNavigator /> : <Onboarding />
}