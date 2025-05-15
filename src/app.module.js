import { AppController } from '@/app.controller'
import { KVController } from '@/kv/kv.controller'
import { KVService } from '@/kv/kv.service'
import { UtilityController } from '@/utility/utility.controller'
import { UtilityService } from '@/utility/utility.service'
import { Module } from '@nestjs/common'

// Defines the main application module
@Module({
  imports: [], // Import other modules if needed
  controllers: [AppController, KVController, UtilityController], // Register controllers for handling incoming requests
  providers: [KVService, UtilityService], // Register services for handling business logic and dependency injection
})
export class AppModule {}
