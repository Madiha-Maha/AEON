import { FrequencyPreset } from '../../../packages/shared/src/types';

export const FREQUENCY_PRESETS: Record<FrequencyPreset, { hz: number; label: string; description: string }> = {
  hz_174: { hz: 174, label: "174 Hz", description: "Grounding, tension-easing tone" },
  hz_285: { hz: 285, label: "285 Hz", description: "Restorative, renewal-focused tone" },
  hz_396: { hz: 396, label: "396 Hz", description: "Tension and worry release" },
  hz_417: { hz: 417, label: "417 Hz", description: "Reset and let-go tone" },
  hz_528: { hz: 528, label: "528 Hz", description: "Calm and positivity tuning" },
  hz_639: { hz: 639, label: "639 Hz", description: "Connection-focused tone" },
  hz_741: { hz: 741, label: "741 Hz", description: "Mental clarity and focus" },
  hz_852: { hz: 852, label: "852 Hz", description: "Spaciousness and awareness" },
  hz_963: { hz: 963, label: "963 Hz", description: "Deep stillness, meditation" },
  none:   { hz: 0,   label: "Off", description: "World-data composition only" },
};
