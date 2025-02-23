// Main application module definition
import { KVController } from '@/kv/kv.controller' // Controller responsible for handling incoming requests
import { KVService } from '@/kv/kv.service' // Service handling business logic for authentication
import { Module } from '@nestjs/common'

@Module({
  imports: [], // Import other modules if needed
  controllers: [KVController], // Register controllers
  providers: [KVService], // Register services/providers
})
export class KVModule {} // Root module of the application
