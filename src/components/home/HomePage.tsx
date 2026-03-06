'use client'

import { FontsEnum, Label } from '@/ui'
import { UiKitStory } from '@/ui/stories/UiKitStory'

export const HomePage = () => {
  return (
    <>
      <Label label='Start your project development.' font={FontsEnum.Label24} />
      <UiKitStory />
    </>
  )
}
