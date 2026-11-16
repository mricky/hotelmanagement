<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Services\DynamicPricingService;
use Carbon\Carbon;

class DynamicPricingServiceTest extends TestCase
{
    protected DynamicPricingService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new DynamicPricingService();
    }

    /** @test */
    public function it_applies_weekend_surge_rule_on_friday_and_saturday()
    {
        // 2026-08-29 is a Saturday
        $saturday = Carbon::parse('2026-08-29');
        $baseRate = 1000000.0;
        $occupancy = 50.0; // Normal occupancy

        $result = $this->service->calculateDailyRate($baseRate, $saturday, $occupancy);

        // Expected multiplier: 1.0 (base) + 0.25 (weekend surge) = 1.25 -> Rate = 1,250,000
        $this->assertEquals(1250000.0, $result['calculated_rate']);
        $this->assertContains('WEEKEND_SURGE_BANDUNG (+25%)', $result['rules_applied']);
    }

    /** @test */
    public function it_applies_high_occupancy_surge_when_occupancy_exceeds_80_percent()
    {
        // 2026-08-31 is a Monday (Weekday)
        $monday = Carbon::parse('2026-08-31');
        $baseRate = 1000000.0;
        $occupancy = 85.0; // High occupancy

        $result = $this->service->calculateDailyRate($baseRate, $monday, $occupancy);

        // Expected multiplier: 1.0 (base) + 0.15 (high occupancy) = 1.15 -> Rate = 1,150,000
        $this->assertEquals(1150000.0, $result['calculated_rate']);
    }

    /** @test */
    public function it_enforces_price_guardrails()
    {
        $monday = Carbon::parse('2026-08-31');
        $baseRate = 5000000.0; // Exceeds ceiling
        $occupancy = 90.0;
        $maxGuardrail = 3000000.0;

        $result = $this->service->calculateDailyRate($baseRate, $monday, $occupancy, 150000.0, $maxGuardrail);

        $this->assertEquals($maxGuardrail, $result['calculated_rate']);
        $this->assertContains('PRICE_GUARDRAIL_TRIGGERED', $result['rules_applied']);
    }

    /** @test */
    public function it_validates_minimum_length_of_stay_on_weekends()
    {
        $checkIn = Carbon::parse('2026-08-28'); // Friday
        $checkOut1Night = Carbon::parse('2026-08-29'); // Saturday (1 night stay)
        $checkOut2Nights = Carbon::parse('2026-08-30'); // Sunday (2 nights stay)

        $this->assertFalse($this->service->checkMLOSRequirement($checkIn, $checkOut1Night, 2));
        $this->assertTrue($this->service->checkMLOSRequirement($checkIn, $checkOut2Nights, 2));
    }
}
