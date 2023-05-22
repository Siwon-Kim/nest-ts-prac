import { ApiProperty, PickType } from '@nestjs/swagger';
import { Cat } from '../cats.schema';

// readOnly data들만 표시
export class CatReadOnlyDto extends PickType(Cat, ['email', 'name'] as const) {
  @ApiProperty({
    example: '230958fkdfijv34jvdsij',
    description: 'id',
  })
  id: string;
}
