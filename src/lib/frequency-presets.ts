/**
 * Aeon — The Living Symphony of Earth
 * Pure Frequency Presets Lookup Table
 *
 * Section 3B: Independent pure-tone bed generated with a dedicated OscillatorNode
 * at the exact target Hz — traditional wellness sound-tuning options used for
 * relaxation, meditation, and focus.
 */

import { FrequencyPreset } from '../types';

export interface FrequencyPresetInfo {
  hz: number;
  label: string;
  description: string;
}

export const FREQUENCY_PRESETS: Record<FrequencyPreset, FrequencyPresetInfo> = {
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
