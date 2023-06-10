import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
    selector: 'app-control-line',
    standalone: true,
    imports: [NzToolTipModule],
    templateUrl: './control-line.component.html',
    styleUrls: ['./control-line.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlLineComponent {
    @Input() name: string = '';
    @Input() description: string = '';
}
