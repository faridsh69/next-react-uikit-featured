import { CheckboxController } from './Controllers/CheckboxController'
import { ChecklistController } from './Controllers/ChecklistController'
import { ChipsController } from './Controllers/ChipsController'
import { CustomController } from './Controllers/CustomComponentController'
import { DateController } from './Controllers/DateController'
import { EditorController } from './Controllers/EditorController'
import { RadioController } from './Controllers/RadioController'
import { RatingController } from './Controllers/RatingController'
import { SelectController } from './Controllers/SelectController'
import { TextareaController } from './Controllers/TextareaController'
import { TextController } from './Controllers/TextController'
import { ToggleController } from './Controllers/ToggleController'
import { UploaderController } from './Controllers/UploaderController'
import { InputComponentsEnum } from './Form.enums'

export const getInputController = (component?: InputComponentsEnum) => {
  const inputs = {
    [InputComponentsEnum.Text]: TextController,
    [InputComponentsEnum.Textarea]: TextareaController,
    [InputComponentsEnum.RadioList]: RadioController,
    [InputComponentsEnum.Checkbox]: CheckboxController,
    [InputComponentsEnum.Checklist]: ChecklistController,
    [InputComponentsEnum.Select]: SelectController,
    [InputComponentsEnum.Date]: DateController,
    [InputComponentsEnum.Toggle]: ToggleController,
    [InputComponentsEnum.Rating]: RatingController,
    [InputComponentsEnum.Uploader]: UploaderController,
    [InputComponentsEnum.Chips]: ChipsController,
    [InputComponentsEnum.Editor]: EditorController,
    [InputComponentsEnum.Custom]: CustomController,
  }

  return component && inputs[component] ? inputs[component] : TextController
}
